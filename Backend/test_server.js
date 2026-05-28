import express from "express";
import path from "path";
const app = express();
console.log("Starting minimal server test...");
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.get("/", (req, res) => res.send("OK"));
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
    process.exit(0);
});
