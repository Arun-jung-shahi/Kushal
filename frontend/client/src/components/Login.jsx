import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import '../css/Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate=useNavigate()
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const res = await axios.post(`/api/v1/auth/login`, {
        email,
        password,
      });
      console.log("Response from server:", res);
      if (res && res.data.success) {
        
        toast.success(res.data.message);
        console.log(res.data);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        setTimeout(()=>{
          navigate('/')
        },3000)

       
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
      
    }
  };
  return (
    <>
      <Layout>
        <div className="Login-container">
          <div>
            <h1>Login</h1>
          </div>
          <form onSubmit={handelSubmit}>
            <div className="Logininput-container">
              <input
                type="text"
                placeholder="enter a email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div  className="Logininput-container">
              <input
                type="text"
                placeholder="enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div  className="Logininput-container">
              <button type="submit">login</button>
            </div>
          </form>
          <div>
            <Link to={'/Forget-Password'}>forget password</Link>
          </div>
        </div>
        
      </Layout>
    </>
  );
};

export default Login;
