import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true 
   },
   password:{
    type:String,
    required:true
   },
   profileImage:{
    type:String,
    default:"https://static.vecteezy.com/system/resources/previews/048/926/061/non_2x/bronze-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg"
   },
   role:{
    type:String,
    enum:["admin","user"],
    default:"user"
   }, 
}
,{
    timestamps:true
})

const User = mongoose.model("User", userSchema);

export default User;