import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("https://talktrove.vercel.app/api/v1/user/login", {
        email,
        password,
      });
      if (data?.success) {
        setAuth({ ...auth, user: data?.user, token: data?.token });
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success(data?.message);
        setLoading(false);
        navigate("/chats");
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

  const guest = () => {
    setEmail("guest@example.com");
    setPassword("guest@1S");
  };
  return (
    <div className="py-2">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
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
          Login
        </button>
      </form>
      <button
        disabled={loading}
        className={`text-white w-full bg-red-500 mt-2 hover:bg-red-600 cursor-pointer py-2 text-[18px] rounded-3xl shadow-md ${
          loading && "pointer-events-none "
        }`}
        onClick={guest}
      >
        Get Guest User Credentials
      </button>
    </div>
  );
}
