import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

// Create Messages
export const createMessages = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res
        .status(400)
        .json({ message: "Invaild data passed into request" });
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    var message = await messageModel.create(newMessage);

    message = await message.populate("sender", "name email avatar");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name email avatar",
    });

    // update latest Message

    await chatModel.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message.toObject(),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Message created successfully!",
      message: message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error occured while creating message",
    });
  }
};

// Get All Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.id })
      .populate("sender", "name email avatar")
      .populate("chat");

    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error occured while getting messages",
    });
  }
};

//
