const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const Notification = require("../models/Notification");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı bilgileri getirilemedi" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    user.role = role;
    await user.save();

    res
      .status(200)
      .json({ message: "Kullanıcı rolü başarıyla güncellendi", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kullanıcı rolu değiştirilirken bir hata oluştu" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Bloglar getirilirken bir hata oluştu" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    await Comment.deleteMany({ blog: id });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Blog silinirken bir hata oluştu" });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blog", "title")
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilirken bir hata oluştu" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Yorum başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Yorum silinirken bir hata oluştu" });
  }
};

exports.approveBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { approved: true },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }
    res.status(200).json({ message: "Blog başarıyla onaylandı", blog });
  } catch (error) {
    res.status(500).json({ message: "Blog onaylanırken bir hata oluştu" });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { approved: true },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ message: "Yorum bulunamadı" });
    }
    res.status(200).json({ message: "Yorum başarıyla onaylandı", comment });
  } catch (error) {
    res.status(500).json({ message: "Yorum onaylanırken bir hata oluştu" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const blogCount = await Blog.countDocuments();
    const commentCount = await Comment.countDocuments();

    res.status(200).json({
      userCount,
      blogCount,
      commentCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "İstatistikler getirilirken bir hata oluştu" });
  }
};

exports.getTrendReports = async (req, res) => {
  try {
    const mostCommentedBlogs = await Blog.find()
      .sort({ commentCount: -1 })
      .limit(5)
      .select("title commentCount");

    const mostLikedBlogs = await Blog.find()
      .sort({ likes: -1 })
      .limit(5)
      .select("title likes");

    const mostViewedBlogs = await Blog.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views");

    res.status(200).json({
      mostCommentedBlogs,
      mostLikedBlogs,
      mostViewedBlogs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Blog istatistikleri getirilirken bir hata oluştu" });
  }
};

exports.getTimeBasedStats = async (req, res) => {
  try {
    const dailyBlogActivity = await Blog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyCommentActivity = await Comment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      dailyBlogActivity,
      dailyCommentActivity,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Zaman tabanlı istatistikler getirilirken bir hata oluştu",
      });
  }
};

exports.filteredBlogs = async (req, res) => {
  try {
    const { category, author, approved } = req.query;

    const filter = {};

    if (category) {
      filter.category = await Category.find({
        name: { $regex: category, $options: "i" },
      }).select("_id");
    }

    if (author) {
      filter.author = await User.find({
        $or: [
          { username: { $regex: author, $options: "i" } },
          { email: { $regex: author, $options: "i" } },
        ],
      }).select("_id");
    }

    if (approved !== undefined) filter.approved = approved === "true";

    const blogs = await Blog.find(filter)
      .populate("category", "name")
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Bloglar filtrelenirken bir hata oluştu" });
  }
};

exports.filteredComments = async (req, res) => {
  try {
    const { blog, author, approved } = req.query;

    const filter = {};

    if (blog) {
      const blogIds = await Blog.find({
        title: { $regex: blog, $options: "i" },
      }).select("_id");
      filter.blog = { $in: blogIds };
    }

    if (author) {
      const authorIds = await User.find({
        $or: [
          { username: { $regex: author, $options: "i" } },
          { email: { $regex: author, $options: "i" } },
        ],
      }).select("_id");
      filter.author = { $in: authorIds };
    }

    if (approved !== undefined) filter.approved = approved === "true";

    const comments = await Comment.find(filter)
      .populate("blog", "title")
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Yorumlar filtrelenirken bir hata oluştu" });
  }
};
