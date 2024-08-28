const express = require("express");
const router = express.Router()
const auth = require("../middleware/authMiddleware");
const { sendMessage, fetchMessages } = require("../controllers/messageController");


router.post("/", auth, sendMessage);


router.get("/:chatId", auth, fetchMessages);

module.exports = router;
