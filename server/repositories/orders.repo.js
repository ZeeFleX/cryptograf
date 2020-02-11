const config = require("../config");
const Binance = require("../services/binance.service");
const db = require("../models");
const moment = require("moment");

module.exports = {
  getOrders: async ({ testId = null }) => {
    try {
      let whereCondition = {};
      if (testId) whereCondition.testId = testId;

      const Orders = db.Order.findAll({
        where: whereCondition
      });

      return Orders;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  placeOrder: async ({
    symbol,
    openPrice,
    amount,
    type,
    openTime = moment(),
    isTesting = true,
    testId = null
  }) => {
    try {
      const newOrder = db.Order.create({
        symbol,
        amount,
        type,
        openPrice,
        isTesting,
        testId,
        openTime,
        status: "open"
      });
      return newOrder;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
