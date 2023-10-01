import React, { useState } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
const handelSubmit=async(e)=>{
e.preventDefault()
try {
    const res=await axios.post(`/api/v1/auth/forget-password`,{
        email,
    })
    if(res&&res.data.success){
        toast.success("email sent sucessfully ckeck",res.data.message)
    }
    else{
        toast.error("there is error",res.data.message)
    }
} catch (error) {
    console.log(error)
    toast.error("something went wrong")
}
}
  return (
    <>
      <Layout>
        <form onSubmit={handelSubmit}>
          <div>
            <input
              type="text"
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div>
            <button type="submit"> send</button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default ForgetPassword;
