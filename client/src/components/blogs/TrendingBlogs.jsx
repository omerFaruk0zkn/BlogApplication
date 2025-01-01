import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const TrendingBlogs = ({ trendingBlogs }) => {
  const { status, error } = useSelector((state) => state.blogs);

  if (status === "loading")
    return (
      <ClipLoader
        color="blue"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    );
  if (status === "failed") return toast.error(error);

  return (
    <div>
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
        Trend Olan Bloglar
      </h2>
      {trendingBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <Link
                to={`/blogs/${blog._id}`}
                className="text-xl font-semibold to-gray-700"
              >
                <h3>{blog.title}</h3>
              </Link>
              <p className="to-gray-600 mt-2 flex flex-col">
                <span>Görüntülenme: {blog.views}</span>
                <span>Beğeniler: {blog.likes.length}</span>
                <span>Yorumlar: {blog.commentCount}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 font-semibold text-xl italic">
          Trend blog mevcut değil.
        </p>
      )}
    </div>
  );
};

export default TrendingBlogs;
