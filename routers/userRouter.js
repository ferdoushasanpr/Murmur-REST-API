const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me", authMiddleware, userController.getMe);
router.put("/me", userController.updateMe);
router.delete("/me", userController.deleteMe);
router.get("/email/:email", userController.getUserByEmail);
router.get("/:id", userController.getUserById);

module.exports = router;
