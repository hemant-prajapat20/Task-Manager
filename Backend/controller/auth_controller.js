import User from '../models/user_model.js';   
import bcryptjs from 'bcryptjs';  



export const Signup = async (req, res) => {
    const { name, email, password, profileImageUrl, adminJoinCode} = req.body;
  
    if (!name || !email || !password || name==="" || email=="" || password=="") {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // check if user already exists
    const isAlreadyExist= await User.findOne({email});
    if(isAlreadyExist){
        return res.status(400).json({success:false, message:"User already exists"});
    }

    // check if admin join code is correct & default role is user
    let role = "user";
        if(adminJoinCode === process.env.ADMIN_JOIN_CODE){
            role = "admin";
        }else{
            return res.status(400).json({success:false, message:"Invalid admin join code"});
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
        res.status(500).json({success:false, message:"Failed to register user", error:error.message});
     }  

    }