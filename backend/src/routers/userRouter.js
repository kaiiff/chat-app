const express = require("express");
const { register_user, login, allUsers, myProfile } = require("../controllers/userController");

const router = express.Router();
const upload = require("../middleware/multer");
const auth = require("../middleware/authMiddleware");

router.post("/add_user", upload.array("image", 5), register_user);
router.post("/login", login);
router.get("/users", auth, allUsers);
router.get("/myprofile",auth,myProfile)

module.exports = router;
