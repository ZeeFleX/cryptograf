const db = require("../models");
const Op = db.Sequelize.Op;
const moment = require("moment");
const Strategies = require("./strategy.service");
const { OrdersRepo } = require("../repositories");
const asyncForEach = require("../helpers/asyncForEach.helper");
const WS = require("./ws.service");

class Tester {
  async start({
    startTime = "2019-01-01",
    endTime = "2020-01-01",
    symbol = "BNBUSDT",
    strategy = "MADirection",
    initialBaseBalance = 500,
    initialPriceBalance = 500,
    stopLoss = 2,
    takeProfit = 10,
    riskAmount = 50,
    MAPeriod = 21,
    MADShift = 5,
    trailingStop = 10,
    margin = 1
  }) {
    const newTest = await db.Test.create({
      startTime,
      endTime,
      symbol,
      params: {
        strategy,
        stopLoss,
        takeProfit,
        trailingStop,
        riskAmount,
        MAPeriod,
        MADShift
      },
      initialBaseBalance,
      initialPriceBalance
    });

    await db.TestStat.create({
      testId: newTest.id,
      time: startTime,
      baseBalance: initialBaseBalance,
      priceBalance: initialPriceBalance,
      balance: +initialBaseBalance + +initialPriceBalance
    });

    const candlesData = await db.Candle.findAll({
      where: {
        symbol,
        time: {
          [Op.gte]: moment(startTime).toDate(),
          [Op.lt]: moment(endTime).toDate()
        }
      }
    }).then(Response =>
      Response ? Response.map(candle => candle.toJSON()) : []
    );

    const selectedStrategy = Strategies[strategy];

    const indicatorData = await selectedStrategy.getIndicators(candlesData, {
      MAPeriod,
      MADShift
    });

    await asyncForEach(indicatorData, async (timeSeriesCurrentValue, index) => {
      const signals = selectedStrategy.checkForSignal(
        indicatorData,
        timeSeriesCurrentValue,
        index
      );

      console.log(signals);

      const openOrders = await db.Order.findAll({
        where: {
          symbol,
          testId: newTest.id,
          status: "open"
        }
      });

      await asyncForEach(openOrders, async openOrder => {
        switch (openOrder.type) {
          case "buy":
            if (
              timeSeriesCurrentValue.close < openOrder.stopLoss ||
              timeSeriesCurrentValue.close > openOrder.takeProfit ||
              signals.includes("closeBuy")
            ) {
              await this.closeOrder(
                openOrder.id,
                timeSeriesCurrentValue.time,
                timeSeriesCurrentValue.close,
                margin
              );
            }
            break;
          case "sell":
            if (
              timeSeriesCurrentValue.close > openOrder.stopLoss ||
              timeSeriesCurrentValue.close < openOrder.takeProfit ||
              signals.includes("closeSell")
            ) {
              await this.closeOrder(
                openOrder.id,
                timeSeriesCurrentValue.time,
                timeSeriesCurrentValue.close,
                margin
              );
            }
            break;
        }
      });

      if (signals.includes("buy")) {
        const availableBalance = await this.getAvailableBalance(
          newTest.id,
          "base"
        );
        if (availableBalance > 0) {
          await db.Order.create({
            symbol,
            openPrice: timeSeriesCurrentValue.close,
            amount: (availableBalance * riskAmount) / 100,
            type: "buy",
            openTime: moment(timeSeriesCurrentValue.time),
            isTesting: true,
            status: "open",
            testId: newTest.id,
            stopLoss:
              timeSeriesCurrentValue.close -
              this.calculateDifference(timeSeriesCurrentValue.close, stopLoss),
            // trailingStop:
            //   timeSeriesCurrentValue.close -
            //   this.calculateDifference(
            //     timeSeriesCurrentValue.close,
            //     trailingStop
            //   ),
            takeProfit:
              timeSeriesCurrentValue.close +
              this.calculateDifference(timeSeriesCurrentValue.close, takeProfit)
          });
        }
      } else if (signals.includes("sell")) {
        const availableBalance = await this.getAvailableBalance(
          newTest.id,
          "price"
        );
        if (availableBalance > 0) {
          await db.Order.create({
            symbol,
            openPrice: timeSeriesCurrentValue.close,
            amount: (availableBalance * riskAmount) / 100,
            type: "sell",
            openTime: moment(timeSeriesCurrentValue.time),
            isTesting: true,
            status: "open",
            testId: newTest.id,
            stopLoss:
              timeSeriesCurrentValue.close +
              this.calculateDifference(timeSeriesCurrentValue.close, stopLoss),
            // trailingStop:
            //   timeSeriesCurrentValue.close +
            //   this.calculateDifference(
            //     timeSeriesCurrentValue.close,
            //     trailingStop
            //   ),
            takeProfit:
              timeSeriesCurrentValue.close -
              this.calculateDifference(timeSeriesCurrentValue.close, takeProfit)
          });
        }
      }
    });

    const finalBalance = await db.TestStat.findOne({
      where: {
        testId: newTest.id
      },
      order: [["time", "desc"]]
    }).then(TestStat => {
      return TestStat.balance;
    });

    await db.Test.update(
      {
        summaryProfit:
          finalBalance - (+initialBaseBalance + +initialPriceBalance)
      },
      {
        where: {
          id: newTest.id
        }
      }
    );

    const testResults = await db.Test.findOne({
      where: {
        id: newTest.id
      },
      include: [db.Order]
    });

    WS.sendMessage("testPassed", testResults);
    return testResults;
  }

  async closeOrder(orderId, closeTime, closePrice, margin) {
    let orderForClose = await db.Order.findOne({
      where: {
        id: orderId
      }
    }).then(Order => Order.toJSON());

    if (orderForClose.type === "buy") {
      const profit =
        (orderForClose.amount *
          ((closePrice - orderForClose.openPrice) / orderForClose.openPrice +
            1) -
          orderForClose.amount) *
        margin;

      orderForClose = {
        ...orderForClose,
        status: "closed",
        closeTime,
        closePrice,
        profit
      };
      await db.Order.update(orderForClose, {
        where: {
          id: orderForClose.id
        }
      });

      const currentBalance = await this.getCurrentBalance(
        orderForClose.testId,
        "base"
      );
      await db.TestStat.create({
        testId: orderForClose.testId,
        time: closeTime,
        baseBalance: currentBalance.base + profit,
        priceBalance: currentBalance.price,
        balance: currentBalance.base + currentBalance.price + profit,
        orderId: orderForClose.id
      });

      return orderForClose;
    } else if (orderForClose.type === "sell") {
      const profit =
        (orderForClose.amount *
          ((orderForClose.openPrice - closePrice) / orderForClose.openPrice +
            1) -
          orderForClose.amount) *
        margin;

      orderForClose = {
        ...orderForClose,
        status: "closed",
        closeTime,
        closePrice,
        profit
      };
      await db.Order.update(orderForClose, {
        where: {
          id: orderForClose.id
        }
      });

      const currentBalance = await this.getCurrentBalance(
        orderForClose.testId,
        "price"
      );
      await db.TestStat.create({
        testId: orderForClose.testId,
        time: closeTime,
        baseBalance: currentBalance.base,
        priceBalance: currentBalance.price + profit,
        balance: currentBalance.base + currentBalance.price + profit,
        orderId: orderForClose.id
      });

      return orderForClose;
    }
  }

  async getAvailableBalance(testId, type) {
    const currentBalance = await this.getCurrentBalance(testId, type);

    if (type === "base") {
      const baseBusyBalance = await db.Order.findAll({
        where: {
          testId,
          status: "open",
          type: "buy"
        }
      })
        .then(Orders => {
          return Orders.length ? Orders.map(Order => Order.toJSON()) : [];
        })
        .then(orders => {
          return orders.reduce(function(sum, order) {
            return sum + order.amount;
          }, 0);
        });

      return currentBalance.base - baseBusyBalance;
    } else if (type === "price") {
      const priceBusyBalance = await db.Order.findAll({
        where: {
          testId,
          status: "open",
          type: "sell"
        }
      })
        .then(Orders => {
          return Orders.length ? Orders.map(Order => Order.toJSON()) : [];
        })
        .then(orders => {
          return orders.reduce(function(sum, order) {
            return sum + order.amount;
          }, 0);
        });

      return currentBalance.price - priceBusyBalance;
    }
  }

  async updateTrailingStop(order, trailingStop, currentPrice) {
    const trailingStopDifference = (currentPrice * trailingStop) / 100;
    const newTrailingStop =
      order.type === "buy"
        ? currentPrice - trailingStopDifference
        : currentPrice + trailingStopDifference;

    await db.Order.update(
      {
        trailingStop:
          order.type === "buy"
            ? Math.max(newTrailingStop, order.trailingStop)
            : Math.min(newTrailingStop, order.trailingStop)
      },
      {
        where: {
          id: order.id
        }
      }
    );
  }

  async getCurrentBalance(testId) {
    const lastTestStatEntry = await db.TestStat.findOne({
      where: {
        testId
      },
      order: [["time", "desc"]]
    });

    return {
      base: lastTestStatEntry.baseBalance,
      price: lastTestStatEntry.priceBalance
    };
  }

  calculateDifference(price, value) {
    return (price * value) / 100;
  }
}

module.exports = new Tester();
