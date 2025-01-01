import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchFilteredBlogs } from "../../store/slices/adminSlice";

const AdminBlogFilter = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    approved: "false",
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? (checked ? "true" : "false") : value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== "" && value !== "false"
      )
    );
    dispatch(fetchFilteredBlogs(activeFilters));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleFilterSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex flex-col w-full sm:w-1/3">
            <label htmlFor="category" className="font-semibold text-gray-700">
              Kategori:
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Kategori adı"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/3">
            <label htmlFor="author" className="font-semibold text-gray-700">
              Yazar:
            </label>
            <input
              id="author"
              type="text"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Yazar adı veya email"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/3">
            <label htmlFor="approved" className="font-semibold text-gray-700">
              Onaylı:
            </label>
            <input
              id="approved"
              type="checkbox"
              name="approved"
              checked={filters.approved === "true"}
              onChange={handleFilterChange}
              className="mt-2 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Blogları Filtrele
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogFilter;
