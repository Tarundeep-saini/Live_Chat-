import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  
  useEffect(() => {
    axios.get('/profile')
      .then(response => {
        setId(response.data.userId);
        setUsername(response.data.username);
      })
      .catch(error => {
        console.log(error);
        // Handle the error here (e.g., set default values or show an error message).
      });
  }, []);

  return (
    <userContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </userContext.Provider>
  );
}
