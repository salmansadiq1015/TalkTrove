import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

export default function Register({ setActive }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const postDetails = (image) => {
    setLoading(true);

    if (image === undefined) {
      toast.error("Please select an image!");
      setLoading(false);
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
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          toast.error("Error uploading image");
          setLoading(false);
        });
    } else {
      toast.error("Please select an image!", { duration: 3000 });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/v1/user/register", {
        name,
        email,
        password,
        avatar,
      });
      if (data?.success) {
        setActive("login");
        toast.success(data?.message);
        setLoading(false);
        setAvatar("");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };
  return (
    <div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <img
            src={avatar ? avatar : "/user1.webp"}
            alt="avatar"
            className="w-[3rem] h-[3rem] rounded-full border border-blue-500 shadow-md"
          />
          <label
            htmlFor="avatar"
            disabled={loading}
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
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-800 py-2 px-3 text-black rounded-md outline-none shadow-md "
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-800 py-2 px-3 text-black rounded-md outline-none shadow-md "
          />
          <div className="relative w-full">
            <div
              className="absolute top-[.5rem] right-2 cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {!show ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
            </div>
            <input
              type={!show ? "password" : "text"}
              placeholder="Password@#$%"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-gray-800 w-full py-2 px-3 text-black rounded-md outline-none shadow-md "
            />
          </div>
        </div>
        <button
          disabled={loading}
          className={`text-white bg-blue-500 hover:bg-blue-600 cursor-pointer py-2 text-[18px] rounded-3xl shadow-md ${
            loading && "pointer-events-none animate-pulse"
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}
