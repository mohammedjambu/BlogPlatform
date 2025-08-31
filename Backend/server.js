require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());

// Set up a rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();


const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://blog-platform-six-zeta.vercel.app' // Vercel URL
];

// Setup CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", userRoutes);

const Port = process.env.PORT;
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
