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

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = createToken(user._id);
    user.password = undefined;

    res.status(200).json({ status: "success", token, data: { user } });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
