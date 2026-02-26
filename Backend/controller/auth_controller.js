import User from '../models/user_model.js';   
import bcryptjs from 'bcryptjs';  
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


//for sign up
export const signup = async (req, res,next) => {
    const { name, email, password, profileImageUrl, adminJoinCode} = req.body;
  
    if (!name || !email || !password || name==="" || email=="" || password=="") {
        return next(errorHandler(400,"All fields are required"));
    }

    // check if user already exists
    const isAlreadyExist= await User.findOne({email});
    if(isAlreadyExist){
        return next(errorHandler(400,"User with this email already exists"));
    }

    // check if admin join code is correct & default role is user
    let role = "user";
        if(adminJoinCode === process.env.ADMIN_JOIN_CODE){
            role = "admin";
        }else{
            return next(errorHandler(400,"Invalid admin join code"));
        }
    

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profileImage: profileImageUrl,  
            role,
        });

     try{
        await newUser.save();
        res.json("User registered successfully");
     }
     catch(error){
        next(errorHandler(500,"Failed to register user"));
     }  

    }


  // for sign in
export const signin = async (req, res,next) =>{ 
    try {
        const { email, password } = req.body;
        if (!email || !password || email=="" || password=="") {
         return next(errorHandler(400,"All fields are required"));
        }       
  const validUser= await User.findOne({email});
  if(!validUser){
    return next(errorHandler(404,"User not found with this email"));
  }

  // compare password
  const validPassword = await bcryptjs.compare(password, validUser.password);
  if(!validPassword){
    return next(errorHandler(400,"Invalid password"));
  }

  //create JWT token
  const token = jwt.sign(
    {Id: validUser._id,role: validUser.role },process.env.JWT_SECRET)

   const {password:pass, ...rest}=validUser._doc
   res.status(200).cookie("access_token", token,{ httpOnly:true}).json(rest)
   
}
catch (error) {
    next(errorHandler(500,"Failed to sign in"));    
}}

//for userprofile
export const userProfile = async (req,res,next)=>{
    try {
        const user = await User.findById(req.user.Id)
        if(!user){
            return next(errorHandler(404,"User not found"));
        }
        const {password:pass, ...rest}=user._doc
        res.status(200).json(rest)
    }catch (error) {
        next(error);
    }
}

//for update user profile

export const updateUserProfile = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.Id)
        if(!user){
            return next(errorHandler(404,"User not found"));
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = await bcryptjs.hash(req.body.password,10);
        }   

        const updatedUser = await user.save();
        const {password:pass, ...rest}=user._doc
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

export const uploadImage = async (req,res,next)=>{
    try{
        if(!req.file){
            return next(errorHandler(400,"No file Uploaded"))
        }
        const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
     console.log(req.file);
         res.status(200).json({imageUrl})
    }catch(error){
        next(error)
    }
}