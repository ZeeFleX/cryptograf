const Binance = require("../services/binance.service");
const db = require("../models");
const moment = require("moment");
const Op = db.Sequelize.Op;
const IndicatorsRepo = require("./indicators.repo.js");

module.exports = {
  getCandles: async ({
    limit = 100,
    endTime = "2020-02-01",
    symbols = null,
    indicators = null
  }) => {
    symbols = symbols
      ? symbols.split(",").map(symbol => symbol.toUpperCase())
      : null;
    indicators = indicators
      ? indicators.split(",").map(indicatorName => indicatorName.toLowerCase())
      : null;
    console.log(moment(endTime));
    let resultPromisesArray = [];
    symbols.forEach(async symbol => {
      let promise = new Promise(async (resolve, reject) => {
        try {
          let candles = await db.Candle.findAll({
            where: {
              symbol,
              closeTime: {
                [Op.lte]: moment(endTime).toDate()
              }
            },
            order: [["closeTime", "DESC"]],
            limit: +limit
          })
            .then(candles => candles.map(candle => candle.toJSON()).reverse())
            .catch(err => {
              throw new Error(err);
            });

          if (indicators.includes("ma")) candles = IndicatorsRepo.MA(candles);
          if (indicators.includes("madirection") && candles[0].MA)
            candles = IndicatorsRepo.MADirection(candles);
          if (indicators.includes("bands"))
            candles = IndicatorsRepo.Bands(candles);

          resolve(candles);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
      resultPromisesArray.push(promise);
    });
    let result = await Promise.all(resultPromisesArray).then(responses => {
      let symbolResult = {};
      responses.forEach((result, index) => {
        symbolResult[symbols[index]] = result;
      });
      return symbolResult;
    });

    return result;
  },
  sync: async (symbols = [], limit = 1000) => {
    try {
      symbols.forEach(async symbol => {
        const lastCandle = await db.Candle.findOne({
          where: {
            symbol
          },
          order: [["closeTime", "DESC"]]
        }).then(lastCandle => (lastCandle ? lastCandle.toJSON() : null));

        let startTime = lastCandle
          ? moment(lastCandle.closeTime).unix() * 1000 + 1
          : moment("2019-01-01").unix() * 1000;

        while (true) {
          const newCandles = await Binance.getCandles(
            startTime,
            symbol,
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
            where: {
              symbol
            },
            order: [["closeTime", "DESC"]]
          }).then(lastCandle => (lastCandle ? lastCandle.toJSON() : null));

          startTime = moment(lastCandle.closeTime).unix() * 1000 + 1;
        }
      });
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
