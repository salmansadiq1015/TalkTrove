import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useChat } from "../context/authContext";
import { RiLoader2Fill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";

export default function CustomModel({ setShowGroup }) {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { chats, setChats } = useChat();

  // Send Image In Cloudinary
  const postDetails = (image) => {
    setLoading1(true);

    if (image === undefined) {
      toast.error("Please select an image!");
      setLoading1(false);
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/jpg" ||
      image.type === "image/*"
    ) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "socket.io");
      formData.append("cloud_name", "dat1f5g7r");

      fetch("https://api.cloudinary.com/v1_1/dat1f5g7r/image/upload", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.url.toString());
          setLoading1(false);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          toast.error("Error uploading image");
          setLoading1(false);
        });
    } else {
      toast.error("Please select an image!", { duration: 3000 });
      setLoading1(false);
    }
  };

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

  //   Create Group
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !selectedUsers || !avatar) {
      return toast.error("Please fill all the fields!");
    }
    try {
      const { data } = await axios.post("https://talktrove.vercel.app/api/v1/chat/GroupChat", {
        name,
        users: JSON.stringify(selectedUsers.map((user) => user._id)),
        avatar,
      });
      if (data?.success) {
        setChats([...chats, data?.groupChat]);
        toast.success("Group Created!");
        setShowGroup(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete User
  const handleDelete = (user) => {
    const newUsers = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers(newUsers);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <div className="rounded-md flex flex-col gap-2 bg-white mt-[-2rem] w-[20rem] sm:w-[30rem] py-6 px-3">
        <div className="flex items-center justify-end">
          <span
            className="p-[2px] border border-zinc-300 rounded-md cursor-pointer shadow-lg text-white hover:text-sky-500"
            onClick={() => setShowGroup(false)}
          >
            <IoClose className="h-5 w-5 text-gray-900" />
          </span>
        </div>
        <h1 className="text-center font-semibold text-xl">
          Create Group Chat{" "}
        </h1>
        {/* Form */}
        <div className="w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
              <img
                src={avatar ? avatar : "/user1.webp"}
                alt="avatar"
                className="w-[3rem] h-[3rem] rounded-full border border-blue-500 shadow-md"
              />
              <label
                htmlFor="avatar"
                disabled={loading1}
                className={`rounded-md cursor-pointer text-white bg-blue-500 py-2 px-4 hover:bg-blue-600 shadow-md ${
                  loading && "pointer-events-none animate-pulse"
                }`}
              >
                {avatar ? "update" : "Upload"}
              </label>
              <input
                type="file"
                id="avatar"
                onChange={(e) => postDetails(e.target.files[0])}
                className="hidden"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[2.8rem] px-3 border border-gray-800 rounded-md shadow-lg text-[16px] outline-none "
            />
            <input
              type="text"
              placeholder="Add Users eg. John Doe, Jaje Doe, ..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-[2.8rem] px-3 border border-gray-800 rounded-md shadow-lg text-[16px] outline-none "
            />
            {/* Selected Users */}
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
            {/* Render Search Users */}
            {searchResults.length > 0 && (
              <div className="relative w-full h-[8rem] py-3 px-3 rounded-md flex flex-col gap-3 border shadow-md overflow-auto scroll">
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

            <button className="py-2 px-4 flex items-center justify-center gap-2 rounded-md cursor-pointer shadow-md bg-sky-600 hover:bg-sky-700 text-white">
              Create{" "}
              {loading && (
                <RiLoader2Fill className="h-5 w-5 text-white animate-spin" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
