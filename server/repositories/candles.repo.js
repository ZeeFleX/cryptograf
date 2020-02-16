const Binance = require("../services/binance.service");
const db = require("../models");
const moment = require("moment");
const Op = db.Sequelize.Op;

module.exports = {
  getCandles: async ({
    startTime = moment()
      .subtract("months", 3)
      .format("YYYY-MM-DD HH:mm:ss"),
    endTime = moment().format("YYYY-MM-DD HH:mm:ss"),
    symbol = "BTCUSDT"
  }) => {
    try {
      let candles = await db.Candle.findAll({
        where: {
          symbol,
          closeTime: {
            [Op.gte]: startTime,
            [Op.lte]: endTime
          }
        },
        order: [["closeTime", "asc"]]
      })
        .then(candles => candles.map(candle => candle.toJSON()))
        .catch(err => {
          throw new Error(err);
        });
      return candles;
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  sync: async (symbols = [], limit = 1000, period = "1d") => {
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
          : moment("2018-01-01").unix() * 1000;

        while (true) {
          const newCandles = await Binance.getCandles(
            startTime,
            symbol,
            period,
            limit
          ).catch(err => {
            throw new Error(err);
          });

          newCandles.splice(-1, 1);

          if (!newCandles.length) break;

          await db.Candle.bulkCreate(
            newCandles.map(candle => {
              return {
                ...candle,
                period
              };
            })
          );

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
