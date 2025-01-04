import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../store/slices/categorySlice";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state) => state.categories
  );

  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategory) {
      dispatch(addCategory({ name: newCategory }));
      setNewCategory("");
    }
  };

  const handleEditCategory = () => {
    if (editCategory && editId) {
      dispatch(updateCategory({ id: editId, name: editCategory }));
      setEditCategory("");
      setEditId(null);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Kategoriyi silmek istediğinizden emin misiniz?")) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Kategoriler</h2>

      <div className="mb-4 flex">
        <input
          type="text"
          className="border p-2 mr-2 w-full"
          placeholder="Yeni kategori adı"
          value={editId ? editCategory : newCategory}
          onChange={(e) =>
            editId
              ? setEditCategory(e.target.value)
              : setNewCategory(e.target.value)
          }
        />
        <button
          className={`${
            editId ? "bg-orange-500" : "bg-blue-500"
          } text-white p-2`}
          onClick={editId ? handleEditCategory : handleAddCategory}
        >
          {editId ? "Güncelle" : "Ekle"}
        </button>
      </div>

      {status === "loading" && <p>Yükleniyor...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      {categories?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center"
            >
              <span>{category.name}</span>
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded"
                  onClick={() => {
                    setEditId(category._id);
                    setEditCategory(category.name);
                  }}
                >
                  Düzenle
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">Henüz kategori yok</p>
      )}
    </div>
  );
};

export default AdminCategories;
