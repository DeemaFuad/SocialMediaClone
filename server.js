const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");



dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Signup endpoint: http://localhost:${PORT}/signup`);
  console.log(`Login endpoint: http://localhost:${PORT}/login`);
  console.log(`Posts endpoint: http://localhost:${PORT}/posts`);
});
