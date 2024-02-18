import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { useAuth, useChat } from "../context/authContext";
import { TbLoader3 } from "react-icons/tb";
import { MdGroups } from "react-icons/md";
import { getSender } from "../config/ChatLogic";
import CustomModel from "./CustomModel";

export default function ChatUsers({ setSelected }) {
  const [active, setActive] = useState("");
  const { chats, setChats, setSelectedChat } = useChat();
  const [chatLoad, setChatLoad] = useState(false);
  const [auth] = useAuth();
  const userId = auth?.user?.id;
  const [showGroup, setShowGroup] = useState(false);

  // const getUsers = async () => {
  //   try {
  //     const { data } = await axios.get("/api/v1/user/all-users");
  //     setUsers(data.users);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const headers = {
  //   Authorization: auth?.token,
  //   "Content-Type": "application/json",
  // };

  // Access Chat
  const getChats = async () => {
    setChatLoad(true);
    try {
      const { data } = await axios.get(`https://talktrove.vercel.app/api/v1/chat/getChats/${userId}`);
      console.log("data:", data);

      setChats(data);
      setChatLoad(false);
    } catch (error) {
      console.log(error);
      setChatLoad(false);
    }
  };

  useEffect(() => {
    getChats();
    // eslint-disable-next-line
  }, [userId, setSelected]);
  return (
    <>
      <div className="relative w-full h-[calc(100vh-4.5rem)] py-2 overflow-hidden ">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black">My Chats</h1>
          <button
            onClick={() => setShowGroup(true)}
            className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 hover:shadow-2xl py-2 px-2 cursor-pointer rounded-md text-white"
          >
            Create Group <FaPlus className="h-3 w-3 text-white" />{" "}
          </button>
        </div>
        <hr className="w-full bg-gray-300 my-4 h-[2px]" />
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 overflow-auto h-[18rem] sm:h-[25rem] pb-8 pt-2 scroll ">
            {chats?.map((chat) => (
              <div
                className={`flex items-center py-1 px-2 gap-2 shadow-md hover:shadow-xl cursor-pointer border border-sky-500 rounded-md ${
                  chat?._id === active
                    ? "bg-sky-500 text-white shadow-2xl transform scale-[1.02] transition-all duration-300 ease-in-out"
                    : "bg-zinc-100 text-black"
                } `}
                key={chat._id}
                onClick={() => {
                  setActive(chat._id);
                  setSelected(true);
                  setSelectedChat(chat);
                }}
              >
                <img
                  src={
                    !chat?.isGroupChat
                      ? chat?.users[0]._id === auth?.user?.id
                        ? chat?.users[1].avatar
                        : chat?.users[0].avatar
                      : chat?.avatar
                  }
                  alt="avatar"
                  className="w-[2.5rem] h-[2.5rem] rounded-full border-2 border-sky-500 shadow-md shadow-gray-500 filter drop-shadow-md "
                />
                {/* <h3 className="text-[16px] font-medium ">{chat?.users[1].name}</h3> */}
                <h3 className="text-[16px] font-medium ">
                  {!chat?.isGroupChat
                    ? getSender(userId, chat.users)
                    : chat?.chatName}
                </h3>
                <span className="text-end ml-6">
                  {chat?.isGroupChat && (
                    <MdGroups className="h-8 w-8 text-gray-900" />
                  )}
                </span>
                {chatLoad && chat._id === active && (
                  <span className="ml-2">
                    <TbLoader3 className="h-5 w-5 text-fuchsia-600 animate-spin" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Group Chat */}
      {showGroup && (
        <div className=" absolute w-[100vw] h-screen left-0 top-[-4rem] rounded-md shadow-lg py-5 px-3 flex flex-col gap-4 bg-black/50 z-[999]">
          <CustomModel setShowGroup={setShowGroup} />
        </div>
      )}
    </>
  );
}
