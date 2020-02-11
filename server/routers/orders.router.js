const router = require("express").Router();
const { OrdersController } = require("../controllers");

router.get("/", OrdersController.get.all);

router.post("/", OrdersController.post.placeOrder);

module.exports = router;
