import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileBlogs } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";

const UserBlogs = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfileBlogs());
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs?.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-lg w-7/12 md:w-full p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <Link
              to={`/blogs/${blog._id}`}
              className="text-lg font-semibold text-gray-800"
            >
              {blog.title}
            </Link>
            <p className=" to-gray-600 mt-2 break-words whitespace-normal">
              {(() => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(blog.content, "text/html");
                const textContent = doc.body.textContent || "";
                return textContent.length > 100
                  ? `${textContent.substring(0, 100)}...`
                  : textContent;
              })()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBlogs;
