import React from "react";
import "./style.css";

export default function TypingIndicator() {
  return (
    <div className="flex items-center justify-start gap-2 ml-3">
      <div className="w-3 h-3 bg-sky-500  rounded-full  typing " />
      <div className="w-3 h-3 bg-sky-500  rounded-full typing " />
      <div className="w-3 h-3 bg-sky-500  rounded-full typing " />
    </div>
  );
}
