require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a username and password.",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials.",
      });
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "An internal server error occurred.",
    });
  }
};

module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a username and password.",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Username is already taken.",
      });
    }

    const newUser = await User.create({
      username,
      password,
    });

    const payload = { id: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          _id: newUser._id,
          username: newUser.username,
        },
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "An internal server error occurred during registration.",
    });
  }
};
