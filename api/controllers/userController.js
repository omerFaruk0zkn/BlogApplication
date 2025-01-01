const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await User.create({ username, email, password });
    res
      .status(201)
      .json({ message: "Kullanıcı başarıyla kaydedildi", user: newUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Kullanıcı kaydedilirken bir hata oluştu" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Geçersiz kimlik bilgileri" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "Giriş işlemi başarılı", token, user });
  } catch (error) {
    res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı bilgileri getirilirken bir hata oluştu" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı blogları getirilirken bir hata oluştu" });
  }
};

exports.getUserComments = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.user.id })
      .populate("blog")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı yorumları getirilirken bir hata oluştu" });
  }
};

exports.addProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    user.profileImage = `/uploads/profileImages/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profil resmi başarıyla yüklendi",
      profileImage: user.profileImage,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Profil fotoğrafı yüklenirken bir hata oluştu" });
  }
};
