const Follow = require("../models/Follows");
const User = require("../models/Users");

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    const existingFollow = await Follow.findOne({
      followerId: currentUserId,
      followingId: targetUserId,
    });

    if (existingFollow) {
      await Follow.deleteOne({ _id: existingFollow._id });

      await User.findByIdAndUpdate(currentUserId, {
        $inc: { followedCount: -1 },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $inc: { followerCount: -1 },
      });

      return res
        .status(200)
        .json({ followed: false, message: "Unfollowed successfully" });
    } else {
      await Follow.create({
        followerId: currentUserId,
        followingId: targetUserId,
      });

      await User.findByIdAndUpdate(currentUserId, {
        $inc: { followedCount: 1 },
      });
      await User.findByIdAndUpdate(targetUserId, {
        $inc: { followerCount: 1 },
      });

      return res
        .status(201)
        .json({ followed: true, message: "Followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkFollowStatus = async (req, res) => {
  try {
    const follow = await Follow.findOne({
      followerId: req.user.id,
      followingId: req.params.id,
    });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
