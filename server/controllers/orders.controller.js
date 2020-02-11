const { OrdersRepo } = require("../repositories");
const { Tester } = require("../services");

module.exports.get = {
  all: async (req, res, next) => {
    try {
      const orders = await OrdersRepo.getOrders(req.query);
      res.json(orders);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {
  placeOrder: async (req, res, next) => {
    try {
      const newOrder = await OrdersRepo.placeOrder(req.body);
      res.json(newOrder);
    } catch (error) {
      console.error(error);
      res.json(err);
    }
  }
};
