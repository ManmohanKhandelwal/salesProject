import React from "react";

const CustomLoader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex space-x-3">
        <div className="w-5 h-5 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: "-0.3s" }}></div>
        <div className="w-5 h-5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "-0.1s" }}></div>
        <div className="w-5 h-5 rounded-full bg-blue-500 animate-pulse"></div>
        <div className="w-5 h-5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-5 h-5 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
      </div>
    </div>
  );
};

export default CustomLoader;
