const router = require("express").Router();
const { IndicatorsController } = require("../controllers");

router.get("/ma", IndicatorsController.get.MA);

module.exports = router;
