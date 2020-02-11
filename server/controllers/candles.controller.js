const { CandlesRepo } = require("../repositories");
const moment = require("moment");
const { Indicator } = require("../services/");

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

      res.json({
        candles,
        indicators
      });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {};
