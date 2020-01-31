const router = require("express").Router();
const { CandlesController } = require("../controllers");

router.get("/", CandlesController.get.candles);

module.exports = router;
