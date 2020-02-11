const router = require("express").Router();
const { AccountsController } = require("../controllers");

router.get("/info", AccountsController.get.info);

module.exports = router;
