import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import {
  fetchBlogs,
  fetchBlogsByCategory,
  searchBlogs,
} from "../../store/slices/blogSlice";

const BlogFilter = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const [selectedCategories, setSelectedCategories] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);

    if (!selectedOptions || selectedOptions[0].value === "all") {
      dispatch(fetchBlogs());
    } else {
      dispatch(fetchBlogsByCategory(selectedOptions[0].value));
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      dispatch(searchBlogs({ query: searchTerm }));
    } else if (
      selectedCategories?.[0]?.value === "all" ||
      !selectedCategories
    ) {
      dispatch(fetchBlogs());
    } else {
      dispatch(fetchBlogsByCategory(selectedCategories[0].value));
    }
  };

  const categoryOptions = [
    { value: "all", label: "Hepsi" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 py-4">
      <div className="flex items-center gap-4 w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          className="border rounded-md p-2 w-full max-w-xs sm:max-w-sm"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Ara
        </button>
      </div>

      <div className="flex items-center sm:justify-end w-full">
        <label
          htmlFor="category"
          className="text-sm lg:text-lg font-medium text-gray-700 sm:mr-4"
        >
          Kategoriye Göre Filtrele:
        </label>
        <Select
          id="category"
          name="category"
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleFilterChange}
          isMulti
          isClearable
          placeholder="Kategori seçiniz..."
          className="react-select-container ml-2 sm:ml-0"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
};

export default BlogFilter;
