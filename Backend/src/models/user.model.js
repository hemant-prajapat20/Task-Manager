import mongoose from "mongoose";

/**
 * User Schema defining the structure of user documents in MongoDB.
 * Includes basic info, profile image, and role-based access control.
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false // Don't include password by default in queries
    },
    profileImage: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/048/926/061/non_2x/bronze-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

export default User;
