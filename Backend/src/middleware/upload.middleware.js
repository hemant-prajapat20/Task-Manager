import multer from "multer";
import path from "path";
import AppError from "../utils/appError.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure disk storage for Multer.
 * Files will be stored in the root 'uploads/' directory.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Point to the root 'uploads' directory
        const uploadsPath = path.join(__dirname, "..", "..", "uploads");
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        // Unique filename using timestamp to avoid collisions
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    },
});

/**
 * Filter to ensure only common image types are uploaded.
 */
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError("Invalid file type. Only JPEG, PNG, and JPG are allowed.", 400), false);
    }
};

/**
 * Multer middleware instance.
 */
const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // limit to 5MB
});

export default upload;
