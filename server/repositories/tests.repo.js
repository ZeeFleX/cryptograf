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
      const Test = await db.Test.findOne({
        where: {
          id: +testId
        }
      }).then(Response => Response.toJSON());

      const TestStats = await db.TestStat.findAll({
        where: {
          testId: Test.id
        },
        order: [["time", "asc"]]
      });

      const Orders = await db.Order.findAll({
        where: {
          testId: Test.id
        },
        order: [["id", "asc"]]
      });

      return {
        ...Test,
        Orders,
        TestStats
      };
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
