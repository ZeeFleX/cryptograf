const router = require("express").Router();
const { AccountsController } = require("../controllers");

router.get("/:accountId", AccountsController.get.info);
router.post("/login", AccountsController.post.login);
router.get("/ma", AccountsController.get.MA);

module.exports = router;
