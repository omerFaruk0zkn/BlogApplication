import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBlogById } from "../../store/slices/blogSlice";
import PopularComments from "../../components/comments/PopularComments";
import Comments from "../../components/comments/Comments";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  if (!blog)
    return (
      <ClipLoader
        color="blue"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    );
  if (error) return toast.error(error);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
        {blog.title}
      </h1>
      <p
        className="text-sm md:text-lg text-gray-700 mb-6 leading-relaxed break-words whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></p>
      <small className="text-xs md:text-lg text-gray-500 flex items-center gap-2">
        <span>Yazar: {blog.author?.username || "Bilinmiyor"}</span>
        <span>Kategori: {blog.category?.name || "Bilinmiyor"}</span>
        <span>Görüntülenme: {blog.views}</span>
        <span>Beğeni sayısı: {blog.likes.length}</span>
        <span>Yorum sayısı: {blog.commentCount}</span>
      </small>
      <div className="space-y-6 mt-4">
        <PopularComments blogId={blog._id} />
        <Comments blogId={blog._id} />
      </div>
    </div>
  );
};

export default BlogDetail;
