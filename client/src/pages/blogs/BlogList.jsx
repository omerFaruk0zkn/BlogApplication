import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteBlog,
  fetchBlogs,
  resetBlogs,
  toggleLikeBlog,
} from "../../store/slices/blogSlice";
import { decodeToken } from "../../utils/decodeToken";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import BlogFilter from "../../components/blogs/BlogFilter";

const BlogList = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const tokenData = token ? decodeToken(token) : null;

  const { blogs, status, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(resetBlogs());
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bu blogu silmek istediğinizden emin misiniz?")) {
      dispatch(deleteBlog(id))
        .then(() => toast.success("Blog başarıyla silindi"))
        .catch(() => toast.error("Bir hata oluştu"));
    }
  };

  const handleLike = (blogId) => {
    dispatch(toggleLikeBlog(blogId))
      .then(() =>
        toast.success("Beğeni veya beğenmeme işlemi başarıyla tamamlandı")
      )
      .catch(() => toast.error("Bir hata oluştu"));
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
    <div>
      <BlogFilter />
      {blogs && blogs?.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const isLikedByUser = token
              ? blog.likes.includes(tokenData.id)
              : null;
            return (
              <li key={blog._id} className="p-4 border rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {blog.title}
                  </Link>
                </h2>
                <p className="text-gray-700 text-sm md:text-lg break-words whitespace-pre-wrap">
                  {(() => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                      blog.content,
                      "text/html"
                    );
                    const textContent = doc.body.textContent || "";
                    return textContent.length > 100
                      ? `${textContent.substring(0, 100)}...`
                      : textContent;
                  })()}
                </p>
                <small className="text-gray-500">
                  Yazar: {blog.author?.username || "Bilinmiyor"}
                </small>
                <div className="flex items-center justify-between">
                  <div>
                    {token && (
                      <div className="mt-2 flex space-x-2">
                        {tokenData.username === blog.author.username && (
                          <>
                            <Link
                              to={`/blogs/edit/${blog._id}`}
                              className="text-blue-500 hover:underline"
                            >
                              Güncelle
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-500 hover:underline"
                            >
                              Sil
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleLike(blog._id)}
                          className={`${
                            isLikedByUser ? "text-red-500" : "text-green-500"
                          } hover:underline`}
                        >
                          {isLikedByUser ? "Beğenme" : "Beğen"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Kategori:{" "}
                    <span className="font-semibold">{blog.category?.name}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-red-500 text-lg font-semibold mt-4">
          Gösterilecek bir blog yok.
        </p>
      )}
    </div>
  );
};

export default BlogList;
