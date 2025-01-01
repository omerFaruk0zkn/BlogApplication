const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Category = require("../models/Category");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newBlog = await Blog.create({
      title,
      content,
      category,
      author: req.user.id,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: "Blog oluşturulurken bir hata oluştu" });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ approved: true })
      .sort({ createdAt: -1 })
      .populate("author", "username email")
      .populate("category", "name");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Bloglar getirilirken bir hata oluştu" });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("author", "username email")
      .populate("category", "name");
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı." });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Blog getirilirken bir hata oluştu" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bu blogu güncelleme yetkiniz yok" });
    }

    blog.title = title;
    blog.content = content;
    blog.category = category;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Blog güncellenirken bir hata oluştu" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu blogu silme yetkiniz yok" });
    }

    await Comment.deleteMany({ blog: blog._id });

    await blog.deleteOne();

    res.status(200).json({ message: "Blog başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Blog silinirken bir hata oluştu" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById({ _id: blogId });
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    if (!Array.isArray(blog.likes)) {
      blog.likes = [];
    }

    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await blog.save();
      return res.status(200).json({ message: "Beğenme kaldırıldı", blog });
    }

    blog.likes.push(userId);
    await blog.save();
    return res.status(200).json({ message: "Blog beğenildi", blog });
  } catch (error) {
    res.status(500).json({ message: "Blog beğeni işleminde bir hata oluştu" });
  }
};

exports.getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ views: -1, likes: -1, commentCount: -1 })
      .limit(5);

    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Trend bloglar getirilirken bir hata oluştu" });
  }
};

exports.getRecommendedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const userLikes = await Blog.find({ likes: userId.toString() }).select(
      "_id likes"
    );
    const likedBlogIds = userLikes.map((blog) => blog._id);

    const usersWhoLikedBlogs = await Blog.aggregate([
      { $match: { _id: { $in: likedBlogIds } } },
      { $unwind: "$likes" },
      { $group: { _id: "$likes", likedBlogs: { $push: "$_id" } } },
    ]);

    const recommendedBlogIds = usersWhoLikedBlogs.flatMap(
      (user) => user.likedBlogs
    );

    const recommendedBlogs = await Blog.find({
      _id: { $nin: likedBlogIds },
      _id: { $in: recommendedBlogIds },
    })
      .sort({ views: -1, commentCount: -1 })
      .limit(5);

    if (recommendedBlogs.length > 0) {
      res.status(200).json(recommendedBlogs);
    } else {
      res.status(404).json({ message: "Hiçbir öneri mevcut değil" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Önerilen bloglar getirilirken bir hata oluştu" });
  }
};

exports.getPersonalizedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    const interactions = await Blog.find({ "interactions.userId": userId })
      .select("interactions")
      .lean();

    const relatedBlogs = interactions
      .map((blog) => blog.interactions)
      .flat()
      .filter(
        (interaction) => interaction.userId.toString() === userId.toString()
      );

    const blogIds = [
      ...new Set(relatedBlogs.map((interaction) => interaction.type)),
    ];

    const personalizedBlogs = await Blog.find({
      _id: { $nin: blogIds },
    }).limit(5);

    res.status(200).json(personalizedBlogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kişisel bloglar getirilirken bir hata oluştu" });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await Blog.find({ category: categoryId, approved: true })
      .populate("category", "name")
      .populate("author", "username email");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Kategoriye göre bloglar getirilirken bir hata oluştu",
    });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;

    const blogs = await Blog.find({
      approved: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    if (blogs.length === 0) {
      return res.status(404).json({ message: "Hiçbir blog bulunamadı" });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Filtrelenmiş bloglar getirilirken bir hata oluştu" });
  }
};
