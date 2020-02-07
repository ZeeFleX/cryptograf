const router = require("express").Router();
const { OrdersController } = require("../controllers");

router.get("/", OrdersController.get.all);

router.post("/", OrdersController.post.placeOrder);
router.post("/test", OrdersController.post.startTest);

module.exports = router;
