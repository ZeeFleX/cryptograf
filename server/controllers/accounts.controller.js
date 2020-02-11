const { AccountsRepo, CandlesRepo } = require("../repositories");
const { Indicator } = require("../services");

module.exports.get = {
  info: async (req, res, next) => {
    try {
      const candles = await CandlesRepo.getCandles(req.query);

      const MAD = Indicator.ma(
        candles.map(candle => {
          return {
            time: candle.closeTime,
            value: candle.close
          };
        }),
        {}
      );
      res.json({
        source: candles[124].close,
        ma: MAD[124].value
      });
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
