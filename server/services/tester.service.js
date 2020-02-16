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
    margin = 3
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
      const nextCandle = indicatorData[index + 1];
      const signal = selectedStrategy.checkForSignal(
        indicatorData,
        timeSeriesCurrentValue,
        index
      );

      const openOrders = await db.Order.findAll({
        where: {
          symbol,
          testId: newTest.id,
          status: "open"
        }
      });

      await asyncForEach(openOrders, async openOrder => {
        if (
          openOrder.type === "buy" &&
          (timeSeriesCurrentValue.close < openOrder.stopLoss ||
            timeSeriesCurrentValue.close > openOrder.takeProfit)
        ) {
          const currentBalance = await this.getCurrentBalance(
            newTest.id,
            "base"
          );

          const closedOrder = await this.closeOrder(
            openOrder.id,
            nextCandle.time,
            nextCandle.open,
            margin
          );

          await db.TestStat.create({
            testId: closedOrder.testId,
            time: closedOrder.closeTime,
            baseBalance: currentBalance.base + closedOrder.profit,
            priceBalance: currentBalance.price,
            balance:
              currentBalance.base + currentBalance.price + closedOrder.profit,
            orderId: closedOrder.id
          });
        } else if (
          openOrder.type === "sell" &&
          (nextCandle.open > openOrder.stopLoss ||
            nextCandle.open < openOrder.takeProfit)
        ) {
          const currentBalance = await this.getCurrentBalance(
            newTest.id,
            "price"
          );

          const closedOrder = await this.closeOrder(
            openOrder.id,
            nextCandle.time,
            nextCandle.open,
            margin
          );

          await db.TestStat.create({
            testId: closedOrder.testId,
            time: closedOrder.closeTime,
            baseBalance: currentBalance.base,
            priceBalance: currentBalance.price + closedOrder.profit,
            balance:
              currentBalance.base + currentBalance.price + closedOrder.profit,
            orderId: closedOrder.id
          });
        } else {
          this.updateTrailingStop(openOrder, trailingStop, nextCandle.open);
        }
      });

      if (signal) {
        if (!openOrders.length) {
          if (signal.type === "buy") {
            const availableBalance = await this.getAvailableBalance(
              newTest.id,
              "base"
            );
            if (availableBalance > 0) {
              await db.Order.create({
                symbol,
                openPrice: nextCandle.open,
                amount: (availableBalance * riskAmount) / 100,
                type: signal.type,
                openTime: moment(nextCandle.time),
                isTesting: true,
                status: "open",
                testId: newTest.id,
                stopLoss:
                  signal.stopLoss ||
                  nextCandle.close -
                    this.calculateDifference(nextCandle.close, stopLoss),
                trailingStop:
                  nextCandle.close -
                  this.calculateDifference(nextCandle.close, trailingStop),
                takeProfit:
                  signal.takeProfit ||
                  nextCandle.close +
                    this.calculateDifference(nextCandle.close, takeProfit)
              });
            }
          } else if (signal.type === "sell") {
            const availableBalance = await this.getAvailableBalance(
              newTest.id,
              "price"
            );
            if (availableBalance > 0) {
              await db.Order.create({
                symbol,
                openPrice: nextCandle.open,
                amount: (availableBalance * riskAmount) / 100,
                type: signal.type,
                openTime: moment(nextCandle.time),
                isTesting: true,
                status: "open",
                testId: newTest.id,
                stopLoss:
                  signal.stopLoss ||
                  nextCandle.close +
                    this.calculateDifference(nextCandle.close, stopLoss),
                trailingStop:
                  nextCandle.close +
                  this.calculateDifference(nextCandle.close, trailingStop),
                takeProfit:
                  signal.takeProfit ||
                  nextCandle.close -
                    this.calculateDifference(nextCandle.close, takeProfit)
              });
            }
          }
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
