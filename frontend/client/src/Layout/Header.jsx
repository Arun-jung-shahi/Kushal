import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";
import { useAuth } from "../context/authContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [auth, setAuth, handelLogout] = useAuth();
  const navigate = useNavigate();
  const handelOut = async () => {
    try {
      const res = await axios.post(`/api/v1/auth/logout`);
      handelLogout();
      if (res && res.data.success) {
        toast.success("logout sucsess");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something is wrong");
    }
  };
  return (
    <>
      <div className="nav-top">
        <ul>
          <Link className="link" to={"/"}>
            <li>Home</li>
          </Link>
          {!auth?.user ? (
            <>
              <Link className="link" to={"/register"}>
                <li>register</li>
              </Link>
              <Link className="link" to={"/login"}>
                <li>Login</li>
              </Link>
            </>
          ) : (
            <>
              <li onClick={handelOut}>logout</li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;
