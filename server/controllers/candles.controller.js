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

      let HACandles = [];

      candles.forEach((candle, index) => {
        if (!index) {
          HACandles.push({ ...candle });
        } else {
          const prevCandle = HACandles[index - 1];
          const close =
            (candle.open + candle.high + candle.low + candle.close) / 4;
          const open = (prevCandle.open + prevCandle.close) / 2;
          const high = Math.max(candle.high, open, close);
          const low = Math.min(candle.low, open, close);

          HACandles.push({
            ...candle,
            close,
            high,
            open,
            low
          });
        }
      });

      let indicators = {};
      requiredIndicators.forEach(indicatorName => {
        indicators[indicatorName] = Indicator[
          indicatorName.toLowerCase()
        ](valuesArray, { period: 21 });
      });

      res.json(HACandles);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {};
