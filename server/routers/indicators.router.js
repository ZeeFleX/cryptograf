const router = require("express").Router();
const { IndicatorsController } = require("../controllers");

router.post("/mad", IndicatorsController.post.MAD);
router.post("/ma", IndicatorsController.post.MA);
router.post("/macd", IndicatorsController.post.MACD);
router.post("/channel", IndicatorsController.post.channel);

module.exports = router;
