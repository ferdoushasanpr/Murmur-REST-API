const router = require("express").Router();
const followController = require("../controllers/followController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/:id/follow", authMiddleware, followController.toggleFollow);
router.get(
  "/:id/is-following",
  authMiddleware,
  followController.checkFollowStatus
);

module.exports = router;
