const { Binance, Indicator } = require("../services");
const db = require("../models");
const moment = require("moment");

module.exports = {
  MA: (candles, period) => {
    try {
      const MA = Indicator.MA(candles, period);
      return MA;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
};
