import React, { useEffect, useState } from "react";
import { useAuth, useChat } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { IoClose } from "react-icons/io5";
import SearchUser from "../components/SearchUser";
import ChatUsers from "../components/ChatUsers";
import ChatSection from "../components/ChatSection";
import { FaEye } from "react-icons/fa";
import ChatProfile from "../components/ChatProfile";

export default function Chat() {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(5);
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [selected, setSelected] = useState(false);
  const { selectedChat } = useChat();

  useEffect(() => {
    if (!auth.token || !auth.user) {
      const counter = setInterval(() => {
        setCount((prevVal) => {
          if (prevVal === 0) {
            clearInterval(counter);
            navigate("/");
          }
          return prevVal - 1;
        });
      }, 1000);

      return () => clearInterval(counter);
    }
    // eslint-disable-next-line
  }, [auth.token, auth.user]);
  return (
    <>
      {!auth?.token && (
        <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
          <h1 className="text-center text-3xl font-semibold text-red-500">
            UnAuthorized Access!
          </h1>
          <p className="text-center text-xl text-red-500">
            Rederecting in {count} seconds.
          </p>
        </div>
      )}
      {/* ------------------------------ */}
      <div className="relative w-full h-[calc(100vh-2px)] overflow-hidden p-1 ">
        {show && (
          <div className="absolute top-0 left-0 w-[19rem] bg-black/85 text-white h-[calc(100vh-0rem)]  py-4 px-2 z-50">
            <div className="flex items-center justify-end">
              <span
                className="p-1 bg-gray-800 cursor-pointer rounded-md border border-gray-300 hover:bg-gray-950 "
                onClick={() => setShow(false)}
              >
                <IoClose className="h-5 w-5 text-white cursor-pointer" />
              </span>
            </div>
            <div className=" mt-4 min-h-screen">
              <SearchUser />
            </div>
          </div>
        )}
        {/* Header */}
        <Header setShow={setShow} show={show} setLeft={setLeft} left={left} />
        {/* // Chat */}
        <div className=" relative flex gap-1 flex-1 flex-col sm:flex-row ">
          {/* left */}
          <div
            className={` sm:flex-[.25] sm:relative ${
              left ? "" : "hidden"
            } sm:block absolute top-0 left-0 w-[19rem] h-[calc(100vh-4rem)]  rounded-none shadow-xl sm:rounded-md mt-0 sm:mt-1 py-2 px-2 bg-gray-200 sm:bg-gray-100 z-[40]`}
          >
            {/* Close */}
            <div className="flex items-center justify-end sm:hidden">
              <span
                className="p-1 bg-gray-800 cursor-pointer rounded-md border border-gray-300 hover:bg-gray-950 "
                onClick={() => setLeft(false)}
              >
                <IoClose className="h-5 w-5 text-white cursor-pointer" />
              </span>
            </div>
            {/* Users */}
            <div className="">
              <ChatUsers setSelected={setSelected} />
            </div>
          </div>

          {/* Chat Section */}
          {selected ? (
            <div className=" flex-[1] h-[calc(100vh-4.5rem)]  sm:flex-[.8] mt-1 rounded-lg shadow-xl z-[1] ">
              <div className="w-full p-1 px-4 rounded-tl-md rounded-tr-md shadow-md flex items-center justify-between">
                <h1 className="text-xl font-semibold flex items-center gap-2 shadow-zinc-500 drop-shadow-md ">
                  <img
                    src={
                      !selectedChat?.isGroupChat
                        ? selectedChat?.users[0]._id === auth?.user?.id
                          ? selectedChat?.users[1].avatar
                          : selectedChat?.users[0].avatar
                        : selectedChat?.avatar
                    }
                    alt="Avatar"
                    className="rounded-full w-[2.5rem] h-[2.5rem] border-2 border-green-500 shadow-md shadow-zinc-500 drop-shadow-md"
                  />
                  {selectedChat.chatName === "sender"
                    ? selectedChat?.users[1]?.name
                    : selectedChat?.chatName}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className="hover:border cursor-pointer p-1 hover:bg-slate-500/30 rounded-md hover:shadow-md"
                    onClick={() => setIsShow(true)}
                  >
                    <FaEye className="h-6 w-6" />
                  </span>
                  <span
                    className="hover:border cursor-pointer p-1 hover:bg-slate-500/30 rounded-md hover:shadow-md"
                    onClick={() => setSelected(!selected)}
                  >
                    <IoClose className="h-6 w-6 text-sky-600" />
                  </span>
                </div>
              </div>
              <ChatSection />
            </div>
          ) : (
            <div className=" flex-[1] h-[calc(100vh-4.5rem)]  sm:flex-[.8] mt-1 rounded-lg shadow-xl ">
              <div className="w-full h-[calc(100vh-4.5rem)] flex items-center justify-center flex-col ">
                <video
                  src="/empty.mp4"
                  muted
                  autoPlay
                  loop
                  style={{ height: "15rem" }}
                />
                <h1 className="text-2xl font-semibold  text-center  ">
                  Click on a user to start chating!
                </h1>
              </div>
            </div>
          )}

          {/* Group Details */}
          {isShow && (
            <div className=" absolute w-[100vw] h-screen left-0 top-[-4rem] rounded-md shadow-lg py-5 px-3 flex flex-col gap-4 bg-black/50 z-[999]">
              <ChatProfile setIsShow={setIsShow} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
