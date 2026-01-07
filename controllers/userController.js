const User = require("../models/Users");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid User ID format or Server Error" });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Invalid User Email format or Server Error" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, bio, password, currentPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (password) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({
            message: "Please provide your current password to set a new one",
          });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      user.password = password;
    }

    await user.save();

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: password ? "Profile and password updated" : "Profile updated",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
