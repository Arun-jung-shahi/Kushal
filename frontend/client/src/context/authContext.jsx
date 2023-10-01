import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token:"",
  });
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = Cookies.get("userToken");
    if (data) {
      setAuth({
        ...auth,
        token: data,
      });
    }
  }, []);
  useEffect(() => {
    Cookies.set("userToken", auth.token, { expires: 7 });
  }, [auth.token]);


  const handelLogout=()=>{
    Cookies.remove("userToken")
    setAuth({
      user:null,
      token:"",
    })
  }
  return (
    <AuthContext.Provider value={[auth, setAuth,handelLogout]}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
