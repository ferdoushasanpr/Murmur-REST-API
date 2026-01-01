const mongoose = require("mongoose");
const { Schema } = mongoose;

const followSchema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;
