import React from "react";
import Layout from "../Layout/Layout";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import axios from "axios";
import "../css/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cpassword, setCpassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]+/.test(password);
    const hasLowercase = /[a-z]+/.test(password);
    const hasNumber = /[0-9]+/.test(password);
    const hasSpecialChar = /[!@#$%^&*]+/.test(password);
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };
  const validatePhone = (phone) => {
    return /^[9][0-9]{9}$/.test(phone);
  };
  const validteComparePassword = (password, cpassword) => {
    if (password == cpassword) {
      return true;
    } else {
      return false;
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password || !phone || !address || !cpassword) {
        toast.error("please fill in all fields");
        console.log("Please fill in all fields");
        return;
      }
      if (!validateEmail(email)) {
        toast.error("plz enter validate email");
        console.log("Please enter a valid email");
        return;
      }
      if (!validatePassword(password)) {
        toast.error(
          "Password must contain special character, uppercase, lowercase, and number"
        );
        console.log(
          "Password must contain special character, uppercase, lowercase, and number."
        );
        return;
      }
      if (!validatePhone(phone)) {
        toast.error(
          "Please enter a valid phone number starting with 9 and 10 digits."
        );
        console.log(
          "Please enter a valid phone number starting with 9 and 10 digits."
        );
        return;
      }
      if (!validteComparePassword(password, cpassword)) {
        console.log("password and conform password didnt match");
        toast.error("password and conform password didnt match");
        return;
      }
      if (!(name.length >= 2 && name.length <= 20)) {
        toast.error("Name should be between 2 and 20 characters");
        console.log("Name should be between 2 and 20 characters");

        return;
      }
      if (!(password.length >= 6)) {
        toast.error("password should be of length above 6");
        console.log("password should be of length above 6");
        return;
      }
      const res = await axios.post("/api/v1/auth/register", {
        name,
        password,
        email,
        phone,
        address,
        cpassword,
      });

      if (res && res.data.success) {
        toast.success("registration success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("user already exists");
    }
  };
  return (
    <>
      <Layout>
        <div className="register-container">
          <div>
            <h2>welcome to booking</h2>
          </div>
          <form onSubmit={handelSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-container">
              <input
                type="text"
                placeholder="enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="enter your conform password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />
            </div>
            <div className="input-container">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Register;
