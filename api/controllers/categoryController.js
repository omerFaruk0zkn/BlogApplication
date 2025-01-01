const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kategoriler getirilirken bir hata oluştu" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kategori oluşturulurken bir hata oluştu" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Kategori bulunamadı" });

    category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kategori güncellenirken bir hata oluştu" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kategori başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kategori silinirken bir hata oluştu" });
  }
};
