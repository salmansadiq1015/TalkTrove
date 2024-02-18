import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { TbLoader3 } from "react-icons/tb";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useChat } from "../context/authContext";
import { toast } from "react-hot-toast";

export default function SearchUser() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Search User...");
  const { chats, setChats, selectedChat, setSelectedChat } = useChat();
  const [chatLoad, setChatLoad] = useState(false);
  console.log("Selected Chat User:", selectedChat);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://talktrove.vercel.app/api/v1/user/searchUser?search=${search}`
      );

      setUsers(data.users);
      setLoading(false);
      setSearch("");
      if (data.users.length === 0) {
        setMessage("🧐 No User Found!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Access Chat
  const accessChat = async (userId) => {
    setChatLoad(true);
    try {
      const { data } = await axios.post(`https://talktrove.vercel.app/api/v1/chat/create-chat`, {
        userId: userId,
      });

      if (!chats.find((c) => c._id === data.fullChat._id)) {
        setChats([data?.fullChat, ...chats]);
      }
      setSelectedChat(data?.fullChat);
      toast.success("Chat created!", { duration: 2000 });
      setChatLoad(false);
    } catch (error) {
      console.log(error);
      setChatLoad(false);
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      <div className="w-full h-full ">
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center gap-1 border bg-black/50 h-[3.1rem] rounded-md shadow-lg p-1"
        >
          <input
            type="search"
            placeholder="Search User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-white bg-transparent w-full h-full outline-none px-2 border rounded-md"
          />
          <button
            className={`w-[2.5rem] h-full flex items-center justify-center rounded-md cursor-pointer bg-blue-500 hover:bg-blue-600 ${
              loading && "pointer-events-none"
            }`}
          >
            {loading ? (
              <TbLoader3 className="h-6 w-6 text-red-500 animate-spin " />
            ) : (
              <IoSearch className="h-6 w-6 text-white" />
            )}
          </button>
        </form>
        {loading ? (
          <div className="w-full h-full mt-5">
            <SkeletonTheme baseColor="#ddd" highlightColor="#fff">
              <Skeleton
                count={6}
                duration={2000}
                height={40}
                className="animate-pulse"
              />
            </SkeletonTheme>
          </div>
        ) : (
          <div className="w-full mt-6 flex flex-col gap-3">
            {users.length > 0 ? (
              users &&
              users.map((user) => (
                <div
                  className="w-full p-1 rounded-md flex items-center gap-2 hover:bg-sky-500 hover:text-white bg-white text-black cursor-pointer border-[1px] border-sky-600 overflow-hidden"
                  onClick={() => {
                    accessChat(user._id);
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
                  {chatLoad && (
                    <span className="ml-2">
                      <TbLoader3 className="h-5 w-5 text-fuchsia-600 animate-spin" />
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="mt-4">
                {" "}
                <h1
                  className={`text-lg font-semibold ${
                    message.length > 14 ? "text-red-500" : "text-white"
                  } text-center`}
                >
                  {message}
                </h1>{" "}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
