import React, { useContext } from "react";
import { userContext } from "./UserContext/User-context";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

const Routes = () => {
  const { username, id } = useContext(userContext);
  if (username) {
    return (
      <>
        <Chat />
      </>
    );
  }
  return <Auth />;
};

export default Routes;
