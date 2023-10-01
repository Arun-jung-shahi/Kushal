import mongoose from "mongoose";


export const connectDB=async()=>{
    const conn =await mongoose.connect(process.env.DB_CONN,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    if(conn){
        console.log("database connected")
    }
}