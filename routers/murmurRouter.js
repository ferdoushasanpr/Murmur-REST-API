const router = require("express").Router();
const murmurController = require("../controllers/murmurController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, murmurController.getTimeline);
router.post("/:id/like", murmurController.toggleLike);
router.get("/user/:id", murmurController.getUserMurmurs);
router.post("/me", authMiddleware, murmurController.createMurmur);
router.delete("/me/:id", authMiddleware, murmurController.deleteMurmur);

module.exports = router;
