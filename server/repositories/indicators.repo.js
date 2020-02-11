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
  }
};
