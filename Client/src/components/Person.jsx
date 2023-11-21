import React from "react";
import Avatar from "./Avatar";

const Person = ({
  userId,
  username,
  online,
  selectedUserId,
  setSelectedUserId,
}) => {
//   console.log(username);
  return (
    <div
      onClick={() => {
        setSelectedUserId(userId);
      }}
      className={
        "  border-b border-gray-200 items-center  flex  gap-2 cursor-pointer " +
        (userId === selectedUserId ? " bg-blue-50 " : "")
      }
      key={userId}
    >
      {userId === selectedUserId && (
        <div className="w-1 bg-blue-500 h-16 rounded-r-md "> </div>
      )}
      <div className="flex items-center gap-3 py-4 pl-4">
        <Avatar online={online} username={username} userId={userId} />
        <span>{username} </span>
      </div>
    </div>
  );
};

export default Person;
