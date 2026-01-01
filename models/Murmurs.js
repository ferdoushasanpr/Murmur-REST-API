const mongoose = require("mongoose");
const { Schema } = mongoose;

const murmurSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A murmur must have an author"],
    },
    content: {
      type: String,
      required: [true, "Murmur content cannot be empty"],
      maxlength: [280, "Murmur cannot exceed 280 characters"],
      trim: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

murmurSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

murmurSchema.index({ author: 1, createdAt: -1 });

const Murmur = mongoose.model("Murmur", murmurSchema);
module.exports = Murmur;
