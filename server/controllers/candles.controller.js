const { CandlesRepo } = require("../repositories");
const moment = require("moment");

module.exports.get = {
  candles: async (req, res, next) => {
    try {
      const candles = await CandlesRepo.getCandles(req.query);
      res.json(candles);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {};
