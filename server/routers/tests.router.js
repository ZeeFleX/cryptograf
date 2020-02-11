const router = require("express").Router();
const { TestsController } = require("../controllers");

router.get("/", TestsController.get.all);
router.get("/:testId", TestsController.get.one);
router.post("/", TestsController.post.startTest);
router.delete("/:testId", TestsController.delete.byId);

module.exports = router;
