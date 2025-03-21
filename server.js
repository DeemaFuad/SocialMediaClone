const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const loginRouter = require("./routes/login");  // Import the login route
const verifyToken = require("./verifyToken");
const user = require("./models/user"); 


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();


app.use("/login", loginRouter);  // Attach login route handler

app.get("/picture", verifyToken, async (req, res) => {
  try {
    // Debugging: Ensure req.user contains the expected user data
    console.log("Fetching profile picture for user ID:", req.user?.userId);

    if (!req.user?.userId) {
      return res.status(400).json({ message: "User ID missing in token" });
    }

    // Query the database using the user ID extracted from the token
    const Userr = await user.findById(req.user.userId).select("profilePicture");

    // Check if the user was found
    if (!Userr) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's profile picture URL
    res.json({ profilePicture: Userr.profilePicture });
  } catch (error) {
    console.error("Error fetching user picture:", error.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Signup endpoint: http://localhost:${PORT}/signup`);
  console.log(`Login endpoint: http://localhost:${PORT}/login`);
  console.log(`Posts endpoint: http://localhost:${PORT}/posts`);
});
