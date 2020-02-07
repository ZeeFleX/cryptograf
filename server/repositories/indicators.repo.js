const { Binance, Indicator } = require("../services");
const db = require("../models");
const moment = require("moment");

module.exports = {
  MA: (candles, period) => {
    try {
      return Indicator.MA(candles, period);
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  MADirection: candlesWithMA => {
    try {
      return Indicator.MADirection(candlesWithMA);
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  MADComplex: candlesWithMAD => {
    try {
      return Indicator.MADComplex(candlesWithMAD);
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  Bands: (candles, period) => {
    try {
      return Indicator.Bands(candles, period);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};
