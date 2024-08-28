const Messsage = require("../models/messageModel");
const Chat = require("../models/chatModel");

exports.sendMessage = async (req, res) => {
    try {
        const reqUser = req.user;

        const { content, chat } = req.body;

        if (!content || !chat) {
            return res.status(400).json({
                success: false,
                message: "Please fill the fields!",
            });
        }

        const newMessage = {
            sender: reqUser,
            content: content,
            chat: chat,
        };

        let message = await Messsage.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        message = await Messsage.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        return res.status(201).json({
            success: true,
            msg: "message send successfully!",
            data: message,
        });
    } catch (error) {
        return res.send(error.message);
    }
};

exports.fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "No chatId pass!"
            })
        }

        const message = await Messsage.find({ chat: chatId })


        if (!message) {
            return res.status(400).json({
                success: false,
                message: "message fetch failed!",

            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Message fetch successfully!",
                data: message
            })
        }


    } catch (error) {
        return res.send(error.message);
    }
};


