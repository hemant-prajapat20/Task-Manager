import User from '../models/user.model.js';   
import bcryptjs from 'bcryptjs';  
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Handles user sign-up.
 * Validates request data, hashes password, and creates a new user.
 */
export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, profileImageUrl, adminJoinCode } = req.body;
  
    // 1) Validation
    if (!name || !email || !password) {
        return next(new AppError("All fields (name, email, password) are required", 400));
    }

    // 2) Check if user already exists
    const isAlreadyExist = await User.findOne({ email });
    if (isAlreadyExist) {
        return next(new AppError("User with this email already exists", 400));
    }

    // 3) Manage roles (admin or user based on join code)
    let role = "user";
    if (adminJoinCode) {
        if (adminJoinCode === process.env.ADMIN_JOIN_CODE) {
            role = "admin";
        } else {
            return next(new AppError("Invalid admin join code", 400));
        }
    }
    
    // 4) Hash password and create user
    const hashedPassword = await bcryptjs.hash(password, 12); // Higher cost for better security

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profileImage: profileImageUrl,  
        role,
    });

    await newUser.save();

    // 5) Respond to the user
    res.status(201).json({
        success: true,
        message: "User registered successfully"
    });
});

/**
 * Handles user sign-in.
 * Validates credentials and returns a JWT in an HTTP-only cookie.
 */
export const signin = catchAsync(async (req, res, next) => { 
    const { email, password } = req.body;

    // 1) Validation
    if (!email || !password) {
        return next(new AppError("Email and password are required", 400));
    }

    // 2) Check if user exists (explicitly select password as it's excluded by default in schema)
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) {
        return next(new AppError("User not found with this email", 404));
    }

    // 3) Compare hashed password
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
        return next(new AppError("Invalid credentials", 401));
    }

    // 4) Create JWT token
    const token = jwt.sign(
        { Id: validUser._id, role: validUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "10d" } // Token expires in 10 days
    );

    // 5) Remove password from output and send cookie/response
    const userObject = validUser.toObject();
    delete userObject.password;

    res.status(200)
        .cookie("access_token", token, { 
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", // Secure cookie in production
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        })
        .json({
            success: true,
            data: userObject
        });
});

/**
 * Retrieves the current user's profile based on the ID from the token.
 */
export const userProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.Id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * Updates the current user's profile.
 */
export const updateUserProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.Id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Update fields if they exist in the request
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
        user.password = await bcryptjs.hash(req.body.password, 12);
    }   

    const updatedUser = await user.save();
    
    // Respond without sensitive info
    const userObject = updatedUser.toObject();
    delete userObject.password;

    res.status(200).json({
        success: true,
        data: userObject
    });
});

/**
 * Handles profile image uploads by returning the public URL.
 */
export const uploadImage = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError("No file uploaded", 400));
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    res.status(200).json({
        success: true,
        imageUrl
    });
});

/**
 * Clears the access token cookie to sign out the user.
 */
export const signout = catchAsync(async (req, res, next) => {
    res
      .clearCookie("access_token")
      .status(200)
      .json({
          success: true,
          message: "User has been logged out successfully!"
      });
});
