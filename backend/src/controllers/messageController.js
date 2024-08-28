const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

exports.sendMessage = async (req, res) => {
  try {
    const { content, chat } = req.body;
    const reqUser = req.user;

    if (!content || !chat) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields!",
      });
    }

    const newMessage = await Message.create({
      content,
      chat,
      sender: reqUser,
    });

    await newMessage.populate("sender", "name pic");
    await newMessage.populate("chat");

    // Emit the new message to the chat room
    req.io.to(chat).emit("messageReceived", newMessage);

    res.status(200).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "No chatId provided!",
      });
    }

    const messages = await Message.find({ chat: chatId }).populate("sender", "name pic");

    if (!messages) {
      return res.status(404).json({
        success: false,
        message: "No messages found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully!",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
