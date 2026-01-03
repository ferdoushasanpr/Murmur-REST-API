const router = require("express").Router();
const followController = require("../controllers/followController");

router.post("/:id/follow", followController.toggleFollow);
router.get("/:id/is-following", followController.checkFollowStatus);

module.exports = router;
