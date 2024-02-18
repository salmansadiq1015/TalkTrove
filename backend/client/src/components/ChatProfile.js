import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth, useChat } from "../context/authContext";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";
import { TbLoader3 } from "react-icons/tb";
import { MdUpdate } from "react-icons/md";
import { MdExposurePlus1 } from "react-icons/md";
import { MdGroupRemove } from "react-icons/md";

export default function ChatProfile({ setIsShow }) {
  const { selectedChat } = useChat();
  const [auth] = useAuth();
  const [isAdd, setIsAdd] = useState(false);
  const [isRename, setIsRename] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [chatName, setChatName] = useState("");
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);

  const handleRemove = async (userId, chatId) => {
    if (!userId || !chatId) {
      return toast.error("User Id & Chat Id is required!");
    }
    try {
      const { data } = await axios.put(`https://talktrove.vercel.app/api/v1/chat/remove-user`, {
        userId,
        chatId,
      });
      if (data) {
        toast.success("User removed successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   Add New User
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUsers) {
      return toast.error("Please fill all the fields!");
    }
    setloading(true);
    try {
      await axios.put("https://talktrove.vercel.app/api/v1/chat/add-user", {
        userId: selectedUsers[0]._id,
        chatId: selectedChat._id,
      });

      toast.success("User Added!");
      setIsAdd(false);
      setloading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  // Handle Rename Group
  const handleRenameGroup = async (e) => {
    e.preventDefault();
    setloading1(true);
    if (!chatName || !selectedChat._id) {
      toast.error(" Group name & Chat id is required!");
    }
    try {
      const { data } = await axios.put(`https://talktrove.vercel.app/api/v1/chat/update-group`, {
        chatName: chatName,
        chatId: selectedChat._id,
      });
      if (data) {
        toast.success("Group Name Updated!");
        setIsRename(false);
        setloading1(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setloading1(false);
    }
  };

  // Handle Search
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
      return;
    }
    try {
      const { data } = await axios.get(
        `https://talktrove.vercel.app/api/v1/user/searchUser?search=${search}`
      );
      setSearchResults(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Something went wroung!");
    }
  };

  //   Handle Group
  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      return toast.error("User already added!");
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  // Delete User
  const handleDelete = (user) => {
    const newUsers = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(newUsers);
  };

  // Leave Group
  const handleLeave = async (userId, chatId) => {
    if (!userId || !chatId) {
      return toast.error("User Id & Chat id is required!");
    }
    try {
      const { data } = await axios.put(`https://talktrove.vercel.app/api/v1/chat/remove-user`, {
        userId: userId,
        chatId: chatId,
      });
      if (data) {
        toast.success("Group left successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wroung!");
    }
  };

  return (
    <div className=" flex items-center justify-center w-full h-full ">
      <div className=" w-[20rem] sm:w-[28rem] bg-white py-2 px-4 rounded-md shadow-md shadow-sky-400">
        <div className="flex items-center justify-end">
          <span
            className="p-[2px] border border-zinc-300 rounded-md cursor-pointer shadow-lg text-white hover:text-sky-500"
            onClick={() => setIsShow(false)}
          >
            <IoClose className="h-5 w-5 text-gray-900" />
          </span>
        </div>
        <div className="flex items-center justify-center flex-col gap-2 mt-[-1rem]">
          <img
            src={
              selectedChat.chatName === "sender"
                ? selectedChat?.users[1]?.avatar
                : selectedChat?.avatar
            }
            alt="Avatar"
            className="h-[6rem] w-[6rem] rounded-full border-2 border-green-500 shadow-md shadow-gray-300 filter drop-shadow-md"
          />
          <h1 className="text-2xl font-semibold text-gray-950">
            {selectedChat.chatName === "sender"
              ? selectedChat?.users[1]?.name
              : selectedChat?.chatName}
          </h1>
          <span className="text-[16px] font-semibold text-gray-700">
            {selectedChat.chatName === "sender"
              ? selectedChat?.users[1]?.email
              : ""}
          </span>
          <div className="flex flex-wrap gap-3">
            {selectedChat.chatName === "sender"
              ? ""
              : selectedChat?.users?.map((user) => (
                  <div
                    className=" py-1 px-2 rounded-md shadow-md flex items-center gap-2 bg-sky-600 filter drop-shadow-md shadow-gray-300 text-white"
                    key={user._id}
                  >
                    {user.name}{" "}
                    <IoCloseCircleOutline
                      className="h-5 w-5 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemove(user._id, selectedChat._id)}
                    />
                  </div>
                ))}
          </div>

          {selectedChat.isGroupChat === true && (
            <div className="flex items-center justify-around gap-2">
              <button
                className="rounded-md px-4 flex items-center justify-center h-full  py-2 shadow-gray-300 text-white shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-sky-500 hover:bg-sky-600"
                onClick={() => {
                  setIsAdd(!isAdd);
                  setIsRename(false);
                }}
              >
                Add <MdExposurePlus1 className="h-5 w-5 text-white " />
              </button>
              <button
                className="rounded-md px-4 flex items-center gap-1 justify-center h-full py-2 shadow-gray-300 text-white shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-sky-500 hover:bg-sky-600"
                onClick={() => {
                  setIsRename(!isRename);
                  setIsAdd(false);
                }}
              >
                Update <MdUpdate className="h-5 w-5 text-white " />
              </button>
              <button
                className="rounded-md px-4 flex items-center gap-1 justify-center h-full py-2 shadow-gray-300 text-white shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-red-500 hover:bg-red-600"
                onClick={() => {
                  setIsRename(false);
                  setIsAdd(false);
                  handleLeave(auth?.user.id, selectedChat._id);
                }}
              >
                Leave <MdGroupRemove className="h-5 w-5 text-white " />
              </button>
            </div>
          )}
          {/* Handle Add User */}

          <>
            {isAdd && (
              <div className="w-full">
                <form
                  className=" rounded-md shadow-md py-4 px-2 flex flex-col gap-2 bg-gray-400/50"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    placeholder="Add Users eg. John Doe, Jaje Doe, ..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full h-[2.8rem] px-3 border border-gray-800 rounded-md shadow-lg text-[16px] outline-none "
                  />
                  <div className="flex items-center justify-end">
                    <button
                      disabled={!selectedUsers}
                      className="rounded-md w-[3rem] flex py-2 float-right items-center justify-center h-full px-3 shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-sky-500 hover:bg-sky-600"
                    >
                      {loading ? (
                        <TbLoader3 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <AiOutlineSend className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                </form>
                {selectedUsers.length > 0 && (
                  <div className="w-full py-1 px-1 rounded-md flex flex-wrap gap-3 ">
                    {selectedUsers.map((user) => (
                      <div
                        className="flex items-center gap-1 rounded-md bg-fuchsia-700 py-1 px-2 shadow-md cursor-pointer text-white"
                        key={user._id}
                      >
                        {user.name}
                        <span>
                          <IoClose
                            className="h-4 w-4 cursor-pointer hover:scale-105"
                            onClick={() => {
                              handleDelete(user);
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Render Search Users */}
            {searchResults.length > 0 && (
              <div className="relative w-full h-[4rem] py-3 px-3 rounded-md flex flex-col gap-3 border shadow-md overflow-auto scroll">
                {searchResults &&
                  searchResults?.slice(0, 4).map((user) => (
                    <div
                      className=" w-full  p-1 rounded-md  flex items-center gap-2 hover:bg-sky-500 hover:text-white bg-white text-black cursor-pointer border-[1px] border-sky-600 "
                      onClick={() => {
                        handleGroup(user);
                      }}
                    >
                      <img
                        src={user.avatar}
                        alt="avatar"
                        className="w-[2.3rem] h-[2.3rem] rounded-full border-2 border-sky-500 shadow-lg"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-[16px] ">{user.name}</h2>
                        <span className="text-xs font-semibold ">
                          <b>Email: </b>
                          {user.email.slice(0, 25)}
                          {user.email.length > 25 && "..."}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* Handle Rename Group */}
            {isRename && (
              <div className="w-full">
                <form
                  className="rounded-md shadow-md py-4 px-2 flex flex-col gap-2 bg-gray-400/50"
                  onSubmit={handleRenameGroup}
                >
                  <input
                    type="text"
                    placeholder="Update Group Name"
                    className="rounded-md border border-gray-800 shadow-md px-3 py-2 outline-none"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                  />
                  <div className="flex items-center justify-end">
                    <button
                      disabled={!chatName}
                      className="rounded-md w-[3rem] flex py-2 float-right items-center justify-center h-full px-3 shadow-md hover:shadow-lg transition duration-150 cursor-pointer bg-sky-500 hover:bg-sky-600"
                    >
                      {loading1 ? (
                        <TbLoader3 className="h-5 w-5 text-white animate-spin" />
                      ) : (
                        <AiOutlineSend className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
