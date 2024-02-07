import React from "react";

export default function Profile({ auth }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img
        src={auth?.user?.avatar}
        alt="avatar"
        className="4-[5rem] w-[5rem] rounded-full cursor-pointer border-2 border-sky-500"
      />
      <h3 className="text-2xl font-semibold cursor-pointer select-none text-white text-center">
        {auth?.user?.name}
      </h3>
      <h3 className="text-[1rem] font-medium cursor-pointer select-none text-zinc-200 text-center">
        {auth?.user?.email}
      </h3>
    </div>
  );
}
