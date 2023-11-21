import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const Message = ({ messages, setMessages, selectedUserId, id, ws }) => {
  const [newMessageText, setNewMessageText] = useState("");
  const [isError, setIsError] = useState(true);
  const messageLast = useRef();

  const errorSet = (error) => {
    setIsError(error);
    setNewMessageText("");
    setTimeout(() => {
      setIsError(null);
    }, 2000);
  };

  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();

    if (newMessageText.length === 0) {
      errorSet("Please Write Something to send...");
      return;
    }

    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );
    setNewMessageText("");
    setMessages((prev) => {
      return [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date() + Math.random(),
        },
      ];
    });
    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        const { data } = res;
        setMessages(data);
      });
    }
  };

  const sendFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  useEffect(() => {
    const div = messageLast.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col bg-blue-50 w-2/3 p-2">
      <div className="flex-grow">
        {!selectedUserId && (
          <div className="flex h-full gap-2  items-center justify-center">
            <div className="text-gray-300 font-extrabold">
              {" "}
              Select a person from sidebar
            </div>
          </div>
        )}
        {!!selectedUserId && (
          <div className="relative h-full">
            <div
              key={messages._id}
              className=" absolute inset-0 overflow-y-scroll  w-full"
            >
              {messages.map((message) => {
                return (
                  <div
                    key={message._id}
                    className={
                      "" +
                      (message.sender === id ? " text-right " : " text-left")
                    }
                  >
                    <div
                      className={
                        "inline-block p-2 my-2 rounded-md text-sm  " +
                        (message.sender === id
                          ? " bg-blue-400 text-white  "
                          : " bg-white text-gray-400 ")
                      }
                    >
                      {message.text}
                      {message.file && (
                        <div className=" ">
                          <a
                            target="_blank"
                            className="flex items-center gap-1 border-b "
                            href={
                              "http://localhost:4000/uploads/" + message.file
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                              />
                            </svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messageLast}></div>
            </div>
          </div>
        )}
      </div>
      {!!selectedUserId && (
        <form onSubmit={sendMessage}>
          <div className="bg-red-200 text-red-400">{isError}</div>
          <div className="flex gap-2 ">
            <input
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              type="text"
              className={
                "bg-white border flex-grow p-2" +
                (isError ? " border-red-500  " : "")
              }
              placeholder="Send a message"
            />
            <label
              type="button"
              className="bg-blue-200 p-2 text-gray-600 border border-gray-400 rounded-md  "
            >
              <input type="file" className="hidden" onChange={sendFile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-blue-500 p-2 border border-gray-200 text-white rounded-md "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Message;
