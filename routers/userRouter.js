const router = require("express").Router();
const userController = require("../controllers/userController");

router.get("/:id", userController.getUserById);
router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.delete("/me", userController.deleteMe);

module.exports = router;
