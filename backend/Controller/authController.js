import validator from "validator";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../hashPassword/hashPassword.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
// import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, cpassword, address } = req.body;

    const validEmail = (email) => {
      return validator.isEmail(email);
    };

    const validPassword = (password) => {
      const hasUppercase = /[A-Z]+/.test(password);
      const hasLowercase = /[a-z]+/.test(password);
      const hasNumber = /[0-9]+/.test(password);
      const hasSpecialChar = /[!@#$%^&*]+/.test(password);
      return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    };
    const validPhone = (phone) => {
      const phoneValid = /[9][0-9]{9}/.test(phone);
      return phoneValid;
    };

    if (!(name && email && phone && password && cpassword && address)) {
      return res.status(404).json({
        success: false,
        message: "plz fill up given  field",
      });
    }
    if (!(name.length >= 2 && name.length <= 20)) {
      return res.json({
        message: "plz enter the above 2 and less than 20 word",
      });
    }
    if (!(password.length >= 8)) {
      return res.json({
        message: "plz enter password above 8 letters",
      });
    }
    if (!validEmail(email)) {
      return res.json({
        message: "invalid email",
      });
    }
    if (!validPassword(password)) {
      return res.json({
        message:
          "plz enter password with special char||uppercase||lowercase||number",
      });
    }
    if (!validPhone(phone)) {
      return res.json({
        message: "enter valid phone number starts with 9 and 10 digits",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "user already exist",
      });
    }
    if (!(password == cpassword)) {
      return res.status(404).json({
        success: false,
        message: "password and compare password should match",
      });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
    });

    user.save();
    return res.status(202).json({
      success: true,
      message: "sucessfully register",
    });
  } catch (error) {
    console.log("error while register", error);
    return res.status(404).json({
      success: false,
      message: "error while register",
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "plz fill up this field",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "user doesnt exist fisrt register",
      });
    }
    const PasswordMatch = await comparePassword(password, user.password);
    if (!PasswordMatch) {
      return res.status(400).json({
        success: false,
        error: "password isnt correct",
      });
    }
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "7d",
    });
    res.cookie("userToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
     return res.status(200).json({
      success: true,
      message: "login sucessfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("error in login", error);

   return res.status(400).json({
      success: false,
      message: "error in login",
    });
  }
};
export const logoutController = async (req, res) => {
  try {
    res.cookie("userToken", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(400).json({
      success: false,
      message: "error in logout",
    });
  }
};

export const forgetpasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "plz enter your mail",
      });
    }

    const oldUser = await userModel.findOne({ email });
    if (!oldUser) {
    return  res.status(404).json({
        success: false,
        message: "user doesn't exist plz register",
      });
    }
    const sec = process.env.PASSWORD_SEC;
    const passwordToken = await jwt.sign({ _id: oldUser._id }, sec, {
      expiresIn: "5m",
    });
    if (passwordToken) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "audyajungshahi39@gmail.com",
          pass: "hlcj jxhe qhpb jrer",
        },
      });
      const mailOptions = {
        from: "audyajungshahi39@gmail.com",
        to: email,
        subject: "password reset",
        text: `http://localhost:3000/reset-password/${oldUser._id}/${passwordToken}`,
      };
      console.log(mailOptions);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error while sending mail", error);
        } else {
          console.log("email sent successfully", info);
        }
      });
    }

    return res.status(202).json({
      success: true,
      message: "email sent successfully",
    });
  } catch (error) {
    console.log("error during sending mail", error);
    return res.status(404).json({
      success: false,
      message: "error during mail",
    });
  }
};
export const resetController = async (req, res) => {
  try {
    console.log(req.params);
    const { id, passwordToken } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(404).json({
        success: false,
        message: "enter a password",
      });
    }
    const oldUser = await userModel.findOne({ _id: id });
    if (!oldUser) {
      return res.status(404).json({
        success: false,
        message: "user doesnt exist",
      });
    }
    
    const sec = process.env.PASSWORD_SEC;

    
    const verifyy = await jwt.verify(passwordToken, sec);
    if (!verifyy) {
      return res.status(404).json({
        success: false,
        message: "Token not verified",
      });
    }
    const hashedPassword = await hashPassword(password);
    const setNewPassword = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      }
    );
    if (!setNewPassword) {
      return res.status(500).json({
        success: false,
        message: "Password update failed",
      });
    }
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Error in password reset", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};
