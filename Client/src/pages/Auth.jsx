import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { userContext } from "../UserContext/User-context";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isError, setIsError] = useState(null);

  const errorSet = (error) => {
    setIsError(error);
    setUsername("");
    setPassword("");
    setTimeout(() => {
      setIsError(null);
    }, 2000);
  };

  const { setUsername: setLoggedInUsername, setId } = useContext(userContext);

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const URL = isRegister ? "/register" : "/login";
    try {
      if (!username || !password) {
        errorSet("Please Fill The Form");
        return;
      }
      if (password.length < 4) {
        console.log(password.length);
        errorSet("Password should be at least 4 Words");
        return;
      }
      console.log("Sending Request");
      const responseData = await axios.post(URL, { username, password });
      console.log(responseData);
      const data = responseData.data;
      setLoggedInUsername(username);
      setId(data.id);
      if (!responseData.ok) {
        throw responseData.message.error;
      }
    } catch (error) {
      // console.log(error);
      // errorSet(error.response.data.error);
    }
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center ">
      <form className="w-80 mx-auto mb-14  " onSubmit={handlerSubmit}>
        <div className="h-8 text-center">{isError && isError}</div>
        <input
          value={username}
          onChange={(ev) => {
            setUsername(ev.target.value);
          }}
          type="text"
          placeholder="Username"
          className={
            "block w-full  rounded-sm p-3 mb-2 border" +
            (isError ? " border-red-500 " : null)
          }
        />
        <input
          value={password}
          onChange={(ev) => {
            setPassword(ev.target.value);
          }}
          type="password"
          placeholder="Password"
          className={
            "block w-full  rounded-sm p-3 mb-2 border" +
            (isError ? " border-red-500 " : null)
          }
        />
        <button
          type="submit"
          className={
            "bg-blue-500 text-white block w-full rounded-md p-3 " +
            (isError ? "bg-red-400 " : null)
          }
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <div className="text-center ">
          {isRegister ? "Registered" : "New Here  "}?
          <button
            className="ml-2"
            onClick={(e) => {
              e.preventDefault();
              setIsRegister(!isRegister);
            }}
          >
            {!isRegister ? "Register here " : "Login here"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
