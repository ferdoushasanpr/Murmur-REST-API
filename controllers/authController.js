const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = createToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({ status: "success", token, data: { user: newUser } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
