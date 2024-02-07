import React, { useEffect, useState } from "react";
import { useAuth, useChat } from "../context/authContext";
import { AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./style.css";
import io from "socket.io-client";
import TypingIndicator from "./TypingIndicator";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export default function ChatSection() {
  const { selectedChat, notification, setNotification } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", auth?.user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", (data) => setIsTyping(true));
    socket.on("stop typing", (data) => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

  // Get Messages
  const getMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/v1/messages/get-messages/${selectedChat._id}`
      );
      if (data) {
        setMessages(data?.messages);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  // Send Message Socket
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([...notification, newMessageReceived]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  // Handle Messages
  const handleMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    try {
      const { data } = await axios.post(`/api/v1/messages/create-messages`, {
        content: newMessage,
        chatId: selectedChat._id,
      });
      setNewMessage("");
      socket.emit("new message", data?.message);
      if (data?.success) {
        // getMessages();
        setMessages([...messages, data?.message]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Typing Handler
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator login
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLenght = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLenght && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLenght);
  };

  // Smooth Scroll
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <>
      <div className="relative w-full h-[calc(100vh-7.6rem)] rounded-md overflow-hidden px-1 py-[2px] ">
        <div
          className="w-full h-[100%] rounded-md px-2 bg-gray-100 py-5 overflow-y-auto scroll"
          style={{
            overflow: "hidden",
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          }}
        >
          {loading ? (
            <div className="w-full h-full mt-5">
              <SkeletonTheme baseColor="#333" highlightColor="#fff">
                <Skeleton
                  count={5}
                  duration={2000}
                  height={60}
                  className="animate-pulse"
                />
              </SkeletonTheme>
            </div>
          ) : (
            <div
              id="message-container"
              className="w-full relative h-full rounded-md px-2  py-5 pb-[2rem] overflow-y-auto scroll flex flex-col gap-2"
            >
              {messages?.map((mess, i) => (
                <div
                  className={`flex ${
                    mess?.sender._id === auth?.user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  key={mess._id}
                >
                  <span>
                    <img
                      src={
                        auth?.user?.id === mess?.sender?._id
                          ? mess?.sender?.avatar
                          : auth?.user?.id === selectedChat?.users[0]._id
                          ? selectedChat?.users[1]?.avatar
                          : selectedChat?.users[0]?.avatar
                      }
                      alt="Avatar"
                      name={`${mess?.sender?.name}`}
                      className="w-[2rem] h-[2rem] rounded-full border-2 border-sky-500 shadow-md shadow-gray-300"
                    />
                  </span>

                  <span
                    className={`m-2 rounded-md text-white max-w-[75%] gap-2 w-fit py-1 px-2 shadow-md shadow-gray-300 filter drop-shadow-md cursor-pointer`}
                    style={{
                      backgroundColor: `${
                        mess?.sender._id === auth?.user?.id ? "#0091ff" : "#ccc"
                      }`,
                      color: `${
                        mess?.sender._id === auth?.user?.id ? "white" : "#111"
                      }`,
                    }}
                  >
                    {mess?.content}
                  </span>
                </div>
              ))}
              {/* Typing Indicator */}
              <div className="sticky bottom-1 left-2">
                {isTyping && (
                  <span>
                    <TypingIndicator />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="sticky h-[3.1rem] bottom-0 left-0 w-full rounded-md bg-gray-200/70 border p-1 ">
          <form
            className="w-full h-full flex items-center gap-1"
            onSubmit={handleMessage}
          >
            <input
              type="text"
              placeholder="Message here..."
              value={newMessage}
              onChange={typingHandler}
              className="w-[95%] rounded-md outline-none px-3 shadow-md bg-white h-full"
            />
            <button
              disabled={newMessage.length === 0}
              className={`rounded-md w-[2.7rem] ${
                newMessage.length === 0 && "pointer-events-none bg-sky-400"
              } flex items-center justify-center h-full px-3 shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-sky-500 hover:bg-sky-600`}
            >
              <AiOutlineSend className="h-5 w-5 text-white" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
