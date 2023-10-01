import bcrypt from "bcrypt";
export const hashPassword=async(password)=>{
    try {
        const saltround=12;
        const hashedPassword=await bcrypt.hash(password,saltround);
        return hashedPassword;
    } catch (error) {
        console.log("error while hasing",error)
    }

}




export const comparePassword=async(password,hashedPassword)=>{
const compare=await bcrypt.compare(password,hashedPassword);
if(!compare){
    console.log("error while comparing")
}
return compare;
}
