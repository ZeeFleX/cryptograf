const Binance = require("../services/binance.service");
const db = require("../models");
const moment = require("moment");
const Op = db.Sequelize.Op;
const IndicatorsRepo = require("./indicators.repo.js");

module.exports = {
  getCandles: async ({
    limit = 100,
    endTime = moment().unix() * 1000,
    indicators = null
  }) => {
    indicators = indicators
      ? indicators.split(",").map(indicatorName => indicatorName.toLowerCase())
      : null;

    let candles = await db.Candle.findAll({
      where: {
        closeTime: {
          [Op.lte]: moment(+endTime)
        }
      },
      order: [["closeTime", "DESC"]],
      limit: +limit
    })
      .then(candles => candles.map(candle => candle.toJSON()).reverse())
      .catch(err => {
        throw new Error(err);
      });

    if (indicators.includes("ma")) {
      candles = IndicatorsRepo.MA(candles, 14);
    }
    return candles;
  },
  sync: async limit => {
    try {
      const lastCandle = await db.Candle.findOne({
        order: [["closeTime", "DESC"]]
      }).then(lastCandle => (lastCandle ? lastCandle.toJSON() : null));

      let startTime = lastCandle
        ? moment(lastCandle.closeTime).unix() * 1000 + 1
        : moment("2019-01-01").unix() * 1000;

      while (true) {
        const newCandles = await Binance.getCandles(
          startTime,
          "ETHBTC",
          "1h",
          limit
        ).catch(err => {
          throw new Error(err);
        });

        newCandles.splice(-1, 1);

        if (!newCandles.length) break;

        await db.Candle.bulkCreate(newCandles);

        console.log(
          `${
            newCandles.length
          } successfully recorded in the database. Last candle time: ${moment(
            newCandles[newCandles.length - 1].closeTime
          ).format("YYYY-MM-DD HH:mm:ss")}`
        );

        const lastCandle = await db.Candle.findOne({
          order: [["closeTime", "DESC"]]
        }).then(lastCandle => (lastCandle ? lastCandle.toJSON() : null));

        startTime = moment(lastCandle.closeTime).unix() * 1000 + 1;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
