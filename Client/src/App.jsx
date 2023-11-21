import axios from "axios";
import "./App.css";
import { UserContextProvider } from "./UserContext/User-context";
import Routes from "./Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:4000/api";
  axios.defaults.withCredentials = true;
  // const username = useContext(userContext);
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
