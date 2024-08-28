const { json } = require("body-parser");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = async (req, res) => {
  const reqUser = req.user;

  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: reqUser } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [reqUser, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    const reqUser = req.user;
    console.log("reqUser:::", reqUser);
    Chat.find({ users: { $elemMatch: { $eq: reqUser } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.createGroupChat = async (req, res) => {
  try {
    const reqUser = req.user;
    const { usersId, chatName } = req.body;
    console.log("userId:::", usersId);

    if (!usersId || !chatName) {
      return res.status(400).send({
        message: "please fill all fields!",
      });
    }

    // const usersArray = JSON.parse(usersId)

    if (usersId.length < 2) {
      return res.status(400).json({
        message: "More than 2 people are required for group chat!",
      });
    }

    // already add login user in the group

    usersId.push(reqUser);

    // create group chat data

    const groupChatData = {
      chatName: chatName,
      isGroupChat: true,
      users: usersId,
      groupAdmin: reqUser,
    };

    const result = await Chat.create(groupChatData);

    const fullGroupChats = await Chat.findOne({ _id: result._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json({
      fullGroupChats,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.renameChat = async (req, res) => {
  try {
    const { chatName, chatId } = req.body;

    if (!chatName || !chatId) {
      return res
        .status(400)
        .json({ message: "Please fill the following field!" });
    }

    const reName = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!reName) {
      return res.status(400).json({
        message: "Chat name not updated",
      });
    } else {
      return res.status(200).json({
        message: "Chat name updated successfully!",
        data: reName,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.removeFromGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    if (!userId || !chatId) {
      return res.status(400).json({ message: "Please fill all fields!" });
    }

    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeUser) {
      return res.status(400).json({
        success: false,
        message: "User remove failed!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User removed successfully!",
        data: removeUser,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.addToGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    if (!userId || !chatId) {
      return res.status(400).json({ message: "Please fill all fields!" });
    }

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!addUser) {
      return res.status(400).json({
        success: false,
        message: "User add failed!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User added successfully!",
        data: addUser,
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
