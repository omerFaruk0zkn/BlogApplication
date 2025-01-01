const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Blog = require("./Blog");
const Comment = require("./Comment");
const Notification = require("./Notification");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Lütfen geçerli bir e-posta adresi girin"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "/uploads/profileImages/default.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    await Blog.deleteMany({ author: userId });
    await Comment.deleteMany({ user: userId });
    await Notification.deleteMany({ userId: userId });
    next();
  }
);

module.exports = mongoose.model("User", userSchema);
