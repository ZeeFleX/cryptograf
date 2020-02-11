const router = require("express").Router();
const { IndicatorsController } = require("../controllers");

router.post("/mad", IndicatorsController.post.MAD);
router.post("/ma", IndicatorsController.post.MA);
router.post("/macd", IndicatorsController.post.MACD);

module.exports = router;
