import chatModel from "../models/chatModel.js";
import userModel from "../models/userModel.js";

// Create Chat Controller
export const createChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send({
      success: false,
      message: "User id is required!",
    });
  }
  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email avatar",
  });

  if (isChat.lenght > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await chatModel.create(chatData);

      const fullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).send({
        success: true,
        fullChat,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in create chat controller!",
      });
    }
  }
};

// Fetch Chat Controller
export const fetchChat = async (req, res) => {
  try {
    const userId = req.params.id;
    await chatModel
      .find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "name email avatar",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetch chat controller!",
    });
  }
};

// Group Chat Controller
export const groupChat = async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send({
      success: false,
      message: "Group name and users are required!",
    });
  }
  if (!req.body.avatar) {
    return res.status(400).send({
      success: false,
      message: "Group avatar are required!",
    });
  }
  var users = JSON.parse(req.body.users);
  if (users.lenght < 2) {
    return res.status(400).send({
      success: false,
      message: "Please select at least 2 users!",
    });
  }
  users.push(req.user);

  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      avatar: req.body.avatar,
    });
    // Fetch Group

    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      success: true,
      groupChat: fullGroupChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in group chat controller!",
    });
  }
};

// Rename Group Controller
export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      res.status(400).send({
        success: false,
        message: "Chat_id and chat_name are required!",
      });
    }
    const updateChat = await chatModel
      .findByIdAndUpdate({ _id: chatId }, { chatName: chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(updateChat);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update group controller!",
    });
  }
};

// Remove User from Group
export const removeUser = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      return res.status(400).send({
        success: false,
        message: "Chat Id & user Id is required!",
      });
    }

    const removedUser = await chatModel
      .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(removedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in remove user controller!",
    });
  }
};

// Add User to Group
export const addUser = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
      return res.status(400).send({
        success: false,
        message: "Chat Id & user Id is required!",
      });
    }

    const added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(added);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in add user controller!",
    });
  }
};

// Delete Whole Group

export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    if (!groupId) {
      return res.status(400).send({
        success: true,
        message: "Group Id is required!",
      });
    }
    await chatModel.findByIdAndDelete(groupId);

    res.status(200).send({
      success: true,
      message: "Group deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete group controller!",
    });
  }
};
