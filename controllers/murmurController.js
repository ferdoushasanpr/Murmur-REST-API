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

exports.createMurmur = async (req, res) => {
  try {
    const newMurmur = await Murmur.create({
      content: req.body.content,
      author: req.user.id,
    });

    res.status(201).json(newMurmur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMurmur = async (req, res) => {
  try {
    const murmur = await Murmur.findById(req.params.id);

    if (!murmur) {
      return res.status(404).json({ message: "Murmur not found" });
    }

    if (murmur.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own murmurs" });
    }

    await murmur.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const murmur = await Murmur.findById(req.params.id);
    if (!murmur) return res.status(404).json({ message: "Murmur not found" });

    const isLiked = murmur.likes.includes(req.user.id);

    if (isLiked) {
      murmur.likes.pull(req.user.id);
    } else {
      murmur.likes.push(req.user.id);
    }

    await murmur.save();
    res.status(200).json({ liked: !isLiked, likeCount: murmur.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
