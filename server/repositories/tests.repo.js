const config = require("../config");
const Binance = require("../services/binance.service");
const db = require("../models");
const moment = require("moment");

module.exports = {
  getTests: async () => {
    try {
      const Tests = db.Test.findAll({
        include: [db.Order]
      });
      return Tests;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  getTest: async ({ testId }) => {
    try {
      const Test = db.Test.findOne({
        where: {
          id: testId
        },
        include: [db.Order, db.TestStat]
      });
      return Test;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
  deleteTest: async ({ testId }) => {
    try {
      const result = await db.Test.destroy({
        where: {
          id: testId
        }
      });
      await db.Order.destroy({
        where: {
          testId
        }
      });
      await db.TestStat.destroy({
        where: {
          testId
        }
      });

      return result;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};
