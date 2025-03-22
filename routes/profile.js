const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const User = require("../models/User"); // Ensure correct path

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Upload Profile Picture
router.post("/upload", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded:", req.file);

    // Generate a public URL for the uploaded file
    const filePath = `http://localhost:5000/uploads/${req.file.filename}`;

    // Update user profile picture in the database
    const user = await User.findByIdAndUpdate(
      req.user.userId, // Assuming `userId` is stored in JWT
      { profilePicture: filePath }, // Save file URL in database
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile picture uploaded successfully", profilePicture: filePath });
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
});

// ✅ Serve Static Files (so frontend can access images)
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
