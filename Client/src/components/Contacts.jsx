import React, { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import axios from "axios";
import { userContext } from "../UserContext/User-context";
import Person from "./Person";

const Contacts = ({
  setSelectedUserId,
  selectedUserId,
  offlinePeople,
  onlinePeople,
}) => {
  if (!onlinePeople) {
    return <div>No User #### Online</div>;
  }
  return (
    <div>
      <Logo />
      {Object.keys(onlinePeople).map((userId) => (
        <Person
          key={"online-" + userId}
          userId={userId}
          online={true}
          username={onlinePeople[userId]}
          setSelectedUserId={setSelectedUserId}
          selectedUserId={selectedUserId}
        />
      ))}

      {Object.keys(offlinePeople).map((userId) => (
        <Person
          key={"online-" + userId}
          userId={userId}
          online={false}
          username={offlinePeople[userId].username}
          setSelectedUserId={setSelectedUserId}
          selectedUserId={selectedUserId}
        />
      ))}
    </div>
  );
};

export default Contacts;
