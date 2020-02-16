const config = require("../config");
const { Indicator } = require("../services");

module.exports = {
  getMAD: async (valuesArray, params) => {
    try {
      const MAD = Indicator.mad(valuesArray, params);
      return MAD;
    } catch (err) {
      return err;
    }
  },
  getMA: async (valuesArray, params) => {
    try {
      const MAD = Indicator.ma(valuesArray, params);
      return MAD;
    } catch (err) {
      return err;
    }
  },
  getMACD: async (valuesArray, params) => {
    try {
      const MACD = Indicator.macd(valuesArray, params);
      return MACD;
    } catch (err) {
      return err;
    }
  },
  getChannel: async (candlesArray, params) => {
    try {
      const channel = Indicator.channel(candlesArray, params);
      return channel;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
