import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveBlog,
  deleteBlog,
  fetchAllBlogs,
} from "../../store/slices/adminSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminBlogFilter from "./AdminBlogFilter";
import { Link } from "react-router-dom";

const AdminBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  const handleDelete = (blogId) => {
    if (window.confirm("Blogu silmek istediğinizden emin misiniz ?")) {
      dispatch(deleteBlog(blogId));
    }
  };

  const handleApprove = (blogId) => {
    dispatch(approveBlog(blogId));
  };

  if (status === "loading")
    return (
      <ClipLoader
        color="blue"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    );

  if (status === "failed") return toast.error(error);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-6">
        Yönetici Blog Paneli
      </h1>
      <AdminBlogFilter />
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="text-xl font-semibold text-gray-800 mb-2"
                >
                  {blog.title}
                </Link>
                <p className="text-gray-600 text-sm">
                  Yazar: {blog.author?.email || "Unknown"}
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
                {!blog.approved && (
                  <button
                    onClick={() => handleApprove(blog._id)}
                    className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
                  >
                    Onayla
                  </button>
                )}
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">Henüz blog yok</p>
      )}
    </div>
  );
};

export default AdminBlogs;
