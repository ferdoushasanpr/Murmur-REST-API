const router = require("express").Router();
const murmurController = require("../controllers/murmurController");

router.get("/", murmurController.getTimeline);
router.get("/user/:id", murmurController.getUserMurmurs);
router.post("/:id/like", murmurController.toggleLike);
router.post("/me", murmurController.createMurmur);
router.delete("/me/:id", murmurController.deleteMurmur);

module.exports = router;
