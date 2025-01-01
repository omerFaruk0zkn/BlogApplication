const mongoose = require("mongoose");
const Comment = require("./Comment");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    interactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "view", "comment"],
          required: true,
        },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

blogSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const blogId = this._id;
    await Comment.deleteMany({ blog: blogId });
    next();
  }
);

module.exports = mongoose.model("Blog", blogSchema);
