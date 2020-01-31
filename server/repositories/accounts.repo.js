const config = require("../config");
const Binance = require("../services/binance.service");

module.exports = {
  getAccountInfo: async ({ accountId }) => {
    try {
      Binance.candlesSubscribe(null, (symbol, interval, chart) => {
        console.log("123");
      });
      return Binance.getBalances();
    } catch (err) {
      return err;
    }
  },
  login: async ({ username, password }) => {
    try {
      return { token: "123123" };
    } catch (err) {
      return err;
    }
  }
};
