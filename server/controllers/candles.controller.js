const { CandlesRepo } = require("../repositories");
const moment = require("moment");
const { Indicator } = require("../services/");
const TSV = require("tsv");

module.exports.get = {
  candles: async (req, res, next) => {
    try {
      let requiredIndicators = req.query.indicators
        ? req.query.indicators.split(",")
        : [];

      const candles = await CandlesRepo.getCandles(req.query);

      const valuesArray = candles.map(item => {
        return {
          time: item.closeTime,
          value: item.close
        };
      });

      let indicators = {};
      requiredIndicators.forEach(indicatorName => {
        indicators[indicatorName] = Indicator[
          indicatorName.toLowerCase()
        ](valuesArray, { period: 21 });
      });

      // if (req.query.tsv) {
      //   res.json({
      //     candles: TSV.stringify(
      //       candles.map(candle => {
      //         return {
      //           date: moment(candle.closeTime).format("YYYY-MM-DD HH:mm"),
      //           open: candle.open,
      //           high: candle.high,
      //           low: candle.low,
      //           close: candle.close,
      //           volume: candle.volume
      //         };
      //       })
      //     ),
      //     indicators
      //   });
      // } else {
      //   res.json({
      //     candles,
      //     indicators
      //   });
      // }
      res.json(candles);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {};
