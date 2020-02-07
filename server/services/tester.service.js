const db = require("../models");
const Op = db.Sequelize.Op;
const moment = require("moment");
const Strategies = require("./strategy.service");
const { OrdersRepo } = require("../repositories");
const asyncForEach = require("../helpers/asyncForEach.helper");

class Tester {
  async start({
    startTime = "2019-01-01",
    endTime = "2020-01-01",
    symbol = "BNBBTC",
    strategy = "first"
  }) {
    const testId = 1;
    const trailingStop = 5;
    const stopLoss = 50;
    const takeProfit = 10;
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
    const indicatorData = await selectedStrategy.getIndicators(candlesData);

    await asyncForEach(indicatorData, async (indicatorCurrentValue, index) => {
      const signal = selectedStrategy.checkForSignal(
        indicatorData,
        indicatorCurrentValue,
        index
      );

      const openOrders = await db.Order.findAll({
        where: {
          symbol,
          status: "open"
        }
      });

      await asyncForEach(openOrders, async openOrder => {
        if (
          (openOrder.type === "buy" &&
            indicatorCurrentValue.close < openOrder.stopLoss) ||
          indicatorCurrentValue.close > openOrder.takeProfit
        ) {
          await this.closeOrder(
            openOrder.id,
            indicatorCurrentValue.time,
            indicatorCurrentValue.close
          );
        }
        //if (currentDifference > trailingStop && openOrder.type === "sell") {
        // await this.closeOrder(
        //   openOrder.id,
        //   indicatorCurrentValue.time,
        //   indicatorCurrentValue.close
        // );
        //}
        // const newTrailingStop = Math.max(
        //   openOrder.trailingStop,
        //   this.calculateTrailingStop(
        //     Math.max(openOrder.openPrice, indicatorCurrentValue.close),
        //     trailingStop
        //   )
        // );

        //await this.setTrailingStop(openOrder.id, newTrailingStop);
      });

      if (signal) {
        if (!openOrders.find(order => order.type === signal.type)) {
          if (signal.type === "sell") {
            // await db.Order.create({
            //   symbol,
            //   openPrice: indicatorCurrentValue.close,
            //   amount: 1,
            //   type: signal.type,
            //   openTime: moment(indicatorCurrentValue.time),
            //   isTesting: true,
            //   status: "open",
            //   testId
            // });
          } else if (signal.type === "buy") {
            await db.Order.create({
              symbol,
              openPrice: indicatorCurrentValue.close,
              amount: 1,
              type: signal.type,
              openTime: moment(indicatorCurrentValue.time),
              isTesting: true,
              status: "open",
              testId,
              // trailingStop: this.calculateTrailingStop(
              //   indicatorCurrentValue.close,
              //   trailingStop
              // )
              stopLoss:
                indicatorCurrentValue.close -
                this.calculateDifference(indicatorCurrentValue.close, stopLoss),
              takeProfit:
                indicatorCurrentValue.close +
                this.calculateDifference(
                  indicatorCurrentValue.close,
                  takeProfit
                )
            });
          }
        }
      }
    });

    return indicatorData;
  }

  async setTrailingStop(orderId, trailingStop) {
    await db.Order.update(
      {
        trailingStop
      },
      {
        where: {
          id: orderId
        }
      }
    );
  }

  async closeOrder(orderId, time, price) {
    await db.Order.update(
      {
        status: "closed",
        closeTime: time,
        closePrice: price
      },
      {
        where: {
          id: orderId
        }
      }
    );
  }

  calculateDifference(price, value) {
    return (price * value) / 100;
  }
}

module.exports = new Tester();
