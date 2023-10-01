import React, { useState ,useEffect} from "react";
import Layout from "../Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { id, passwordToken } = useParams();
 

useEffect(() => {
  console.log("ID:", id);
  console.log("Token:", passwordToken);
}, [id, passwordToken]);


  const navigate = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/v1/auth/reset-password/${id}/${passwordToken}`,
        {
          password,
        }
      );
      if (res && res.data.success) {
        toast.success("password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <>
      <Layout>
        <div>
          <form onSubmit={handelSubmit}>
            <div>
              <input
                type="text"
                placeholder="enter the password you wnat to reset"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div>
                <button type="submit">reset password</button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ResetPassword;
