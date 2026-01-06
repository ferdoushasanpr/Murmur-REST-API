const Murmur = require("../models/Murmurs");
const Follow = require("../models/Follows");

exports.getTimeline = async (req, res) => {
  try {
    const limit = 10;
    const { lastCreatedAt } = req.query;

    const followingRelations = await Follow.find({
      followerId: req.user.id,
    }).select("followingId");

    const followingIds = followingRelations.map((rel) => rel.followingId);

    followingIds.push(req.user.id);

    const query = {
      author: { $in: followingIds },
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    const murmurs = await Murmur.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      status: "success",
      results: murmurs.length,
      data: murmurs,
      nextCursor:
        murmurs.length > 0 ? murmurs[murmurs.length - 1].createdAt : null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
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

exports.getUserMurmurs = async (req, res) => {
  try {
    const murmurs = await Murmur.find({ author: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(murmurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
