import React from "react";

const Avatar = ({ userId, username, online }) => {
  // console.log(username);
  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-teal-200",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div
      className={`relative w-10 h-10 ${color} rounded-full  flex items-center `}
    >
      {username && username.length > 0 && (
        <div className="text-center w-full">{username[0]}</div>
      )}
      {/* <div className="text-center w-full">{username[0]}</div> */}
      {online && (
        <div className=" absolute w-3 h-3  bg-green-500 -bottom-1 right-0 rounded-full   border border-white"></div>
      )}
      {!online && (
        <div className=" absolute w-3 h-3  bg-gray-400 -bottom-1 right-0 rounded-full   border border-white"></div>
      )}
    </div>
  );
};

export default Avatar;
