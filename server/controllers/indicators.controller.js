const { IndicatorsRepo } = require("../repositories");

module.exports.get = {};

module.exports.post = {
  MAD: async (req, res, next) => {
    try {
      const { valuesArray, params } = req.body;
      const MAD = await IndicatorsRepo.getMAD(valuesArray, params);
      res.json(MAD);
    } catch (err) {
      console.log(err);
      res.json({ error: 1, message: err.toString() });
    }
  },
  MA: async (req, res, next) => {
    try {
      const { valuesArray, params } = req.body;
      const MA = await IndicatorsRepo.getMA(valuesArray, params);
      res.json(MA);
    } catch (err) {
      console.log(err);
      res.json({ error: 1, message: err.toString() });
    }
  },
  MACD: async (req, res, next) => {
    try {
      const { valuesArray, params } = req.body;
      const MACD = await IndicatorsRepo.getMACD(valuesArray, params);
      res.json(MACD);
    } catch (err) {
      console.log(err);
      res.json({ error: 1, message: err.toString() });
    }
  }
};
