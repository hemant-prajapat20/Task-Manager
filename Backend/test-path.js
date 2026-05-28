import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

console.log("__filename:", __filename);
console.log("__dirname:", __dirname);
console.log("uploadsDir:", uploadsDir);

try {
    const middleware = express.static(uploadsDir);
    console.log("express.static middleware created successfully");
} catch (error) {
    console.error("Error creating express.static middleware:", error);
}
