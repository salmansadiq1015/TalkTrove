export const getSender = (userId, users) => {
  return users[0]._id === userId ? users[1].name : users[0].name;
};

// Same Sender
export const isSameSender = (messages, mess, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== mess.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// IsLast Message
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// chat.chatName === "sender"
//   ? chat?.users[1]?.avatar
//   : chat?.avatar

// selectedChat.chatName === "sender"
//   ? selectedChat?.users[1]?.avatar
//   : selectedChat?.avatar
