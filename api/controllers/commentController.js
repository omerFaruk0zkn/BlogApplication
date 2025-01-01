const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { createNotification } = require("../utils/notificationHelper");

exports.addComment = async (req, res) => {
  const { content, blogId } = req.body;

  const blog = await Blog.findById(blogId);

  if (!content || !blogId) {
    return res.status(400).json({ message: "İçerik ve blog gereklidir" });
  }

  try {
    const comment = await Comment.create({
      content,
      blog: blogId,
      user: req.user.id,
    });

    await Blog.findByIdAndUpdate(blog, { $inc: { commentCount: 1 } });

    if (blog.author._id.toString() !== req.user.id.toString()) {
      await createNotification(
        blog.author._id,
        `${blog.title} başlıklı blogunuza yeni bir yorum geldi.`
      );
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Yorum eklenirken bir hata oluştu" });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorumlar getirilirken bir hata oluştu" });
  }
};

exports.getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({
      blog: blogId,
      approved: true,
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Yorum getirilirken bir hata oluştu" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirilmemiş" });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Yorum güncellenirken bir hata oluştu" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: "Yorum bulunamadı" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirilmemiş" });
    }

    await comment.deleteOne();

    const blog = await Blog.findById(comment.blog);

    if (blog.commentCount > 0) {
      await Blog.findByIdAndUpdate(comment.blog, {
        $inc: { commentCount: -1 },
      });
    }

    res.status(200).json({ message: "Yorum silindi" });
  } catch (error) {
    res.status(500).json({ message: "Yorum silinirken bir hata oluştu" });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.likes.includes(req.user.id)) {
      comment.likes.push(req.user.id);
    }
    comment.dislikes = comment.dislikes.filter(
      (id) => id.toString() !== req.user.id
    );
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Yorum beğenilirken bir hata oluştu" });
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment.dislikes.includes(req.user.id)) {
      comment.dislikes.push(req.user.id);
    }
    comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Yorum beğenesi kaldırılırken bir hata oluştu" });
  }
};

exports.getPopularComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const popularComments = await Comment.find({ blog: blogId, approved: true })
      .populate("user", "username")
      .sort({ likes: -1 })
      .limit(5);
    res.status(200).json(popularComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Popüler yorumlar getirilirken bir hata oluştu" });
  }
};
