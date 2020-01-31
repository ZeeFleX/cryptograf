const {
  AccountsRepo,
  CandlesRepo,
  IndicatorsRepo
} = require("../repositories");
const moment = require("moment");

module.exports.get = {
  info: async (req, res, next) => {
    try {
      const candles = await CandlesRepo.getCandles(req.query);
      res.json(candles);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  MA: async (req, res, next) => {
    try {
      const candles = await CandlesRepo.getCandles(req.query);
      const MA = IndicatorsRepo.MA(candles, +req.query.period);
      console.log(MA);
      res.json(MA);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {
  login: async (req, res, next) => {
    try {
      const account = await AccountsRepo.getAccount(req.params);
      res.json(account);
    } catch (err) {
      console.log(err);
      res.json({ error: 1, message: err.toString() });
    }
  }
};
