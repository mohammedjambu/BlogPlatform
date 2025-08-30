require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes")

app.use(express.json());

const vercelFrontendURL = "https://wanderlust-ebon-iota.vercel.app";

app.use(
  cors({
    origin: ["http://localhost:5173", vercelFrontendURL],
    credentials: true,
  })
);

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

app.use("/api/posts", postRoutes);
app.use("/api/auth", userRoutes);



const Port = process.env.PORT;
app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
})