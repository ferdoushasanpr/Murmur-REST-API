const Murmur = require("../models/Murmurs");
const Follow = require("../models/Follows");

exports.getTimeline = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const followingRelations = await Follow.find({ followerId: req.user.id });
    const followingIds = followingRelations.map((rel) => rel.followingId);

    followingIds.push(req.user.id);

    const murmurs = await Murmur.find({ author: { $in: followingIds } })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      status: "success",
      results: murmurs.length,
      page,
      data: murmurs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
