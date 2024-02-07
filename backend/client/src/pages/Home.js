import React, { useState } from "react";
import "./home.css";
import Register from "../components/Register";
import Login from "../components/Login";

export default function Home() {
  const [active, setActive] = useState("login");
  return (
    <div className="home-container px-2">
      <div className="wrapper flex flex-col gap-4 max-w-[32rem]">
        <div className="bg-white shadow-md rounded-md flex flex-col items-center justify-center py-4 px-3">
          <h1 className="text-cente text-3xl text-blue-500 font-semibold">
            TalkTrove
          </h1>
          <p className="text-center text-[16px] text-zinc-800">
            Discover a treasure trove of meaningful conversations in this
            talk-centric app that values quality connections.
          </p>
        </div>
        <div className="bg-white rounded-md py-4 px-3 flex flex-col gap-8">
          <div className="flex items-center justify-center w-full">
            <div
              className="flex w-[94%] h-[2.8rem]  sm:w-[70%] justify-between items-center bg-black/60 border border-black rounded-3xl  "
              style={{ boxShadow: "0px 0px .6px 1px orangered" }}
            >
              <button
                className={`rounded-3xl h-full text-white font-medium cursor-pointer w-[50%] ${
                  active === "register" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActive("register")}
              >
                Register
              </button>
              <button
                className={`rounded-3xl cursor-pointer text-white font-medium  h-full w-[50%] ${
                  active === "login" ? "bg-blue-500" : ""
                }`}
                onClick={() => setActive("login")}
              >
                Login
              </button>
            </div>
          </div>
          <div className="">
            {active === "register" ? (
              <>
                <Register setActive={setActive} />
              </>
            ) : (
              <>
                <Login />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
