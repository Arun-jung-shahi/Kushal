import mongoose from "mongoose";
import validator from "validator";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:[2,"minimun 2 letter"],
        maxlength:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid email")
            }
        },
    },
    phone:{
        type:String,
        required:true,
        validate(value){
            const hasPhone=/[9][0-9]{9}/.test(value)
            if(!hasPhone){
                throw new Error("number should start with 9 and should contain 10 numbers")

            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            const hasuppercase=/[A-Z]+/.test(value)
            const haslowercase=/[a-z]+/.test(value)
            const hasnumber=/[0-9]+/.test(value)
            const specicalchar=/[!@#$%^&*]+/.test(value)
            if(!(haslowercase&&hasuppercase&&hasnumber&&specicalchar)){
                throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ")

            }
        },
    },
    // cpassword:{
    //     type:String,
    //     required:true
    // },
    address:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        default:0
    },
},{timestamps:true});

export default mongoose.model("users",userSchema)