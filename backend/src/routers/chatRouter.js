const express = require("express");
const auth = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameChat, removeFromGroup, addToGroup } = require("../controllers/chatController");
const router = express.Router()


router.post("/",auth,accessChat)
router.get("/",auth,fetchChats)
 router.post("/group",auth,createGroupChat)
router.put("/rename",auth,renameChat)
 router.put("/groupremove",auth,removeFromGroup)
 router.put("/groupadd",auth,addToGroup)



module.exports =router;