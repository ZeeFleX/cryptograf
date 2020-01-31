const { CandlesRepo, IndicatorsRepo } = require("../repositories");
const moment = require("moment");

module.exports.get = {
  MA: async (req, res, next) => {
    try {
      const candles = await CandlesRepo.getCandles(req.query);
      const MA = IndicatorsRepo.MA(candles, +req.query.period);
      res.json(MA);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {};
