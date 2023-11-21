import React, { useContext, useEffect, useState } from "react";
import Contacts from "../components/Contacts";
import { userContext } from "../UserContext/User-context";
import Message from "../components/Message";
import { unionBy, uniqWith } from "lodash";
import axios from "axios";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState();
  const [offlinePeople, setOfflinePeople] = useState({});
  const [ws, setWs] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState();
  const { username, id, setId, setUsername } = useContext(userContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectToWs();
  }, []);
  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  }

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId,{withCredentials:true}).then((res) => {
        const { data } = res;
        setMessages(data);
      });
    }
  }, [selectedUserId]);

  function logout() {
    console.log("as");
    axios.post("/logout",{withCredentials:true}).then(() => {
      setWs(null);
      setId(null), setUsername(null);
    });
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => {
          return [...prev, { ...messageData }];
        });
      }
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};

    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  const filteredOnlinePeople = { ...onlinePeople };
  delete filteredOnlinePeople[id];

  const messageWithoutDupes = unionBy(messages, "_id");

  useEffect(() => {
    axios.get("/all/users",{withCredentials:true}).then((res) => {
      const offlineUsersArr = res.data
        .filter((p) => p._id !== id)
        .filter(
          (p) => onlinePeople && !Object.keys(onlinePeople).includes(p._id)
        );
      const offlineUsers = {};
      offlineUsersArr.forEach((p) => {
        offlineUsers[p._id] = p;
      });
      setOfflinePeople(offlineUsers);
    });
  }, [onlinePeople]);
  // console.log(messageWithoutDupes);
  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col ">
        <div className="flex-grow">
          <Contacts
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            onlinePeople={filteredOnlinePeople}
            offlinePeople={offlinePeople}
          />
        </div>
        <div className="p-5 text-center">
          <button
            onClick={logout}
            className="test-md text-gray-500 bg-blue-100 py-2 px-4 border  rounded-md  "
          >
            Logout
          </button>
        </div>
      </div>
      <Message
        ws={ws}
        id={id}
        // messages={messages}
        messages={messageWithoutDupes}
        setMessages={setMessages}
        selectedUserId={selectedUserId}
      />{" "}
    </div>
  );
};

export default Chat;
