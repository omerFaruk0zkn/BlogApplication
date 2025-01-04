import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  deleteComment,
  dislikeComment,
  fetchCommentsByBlogId,
  likeComment,
  updateComment,
} from "../../store/slices/commentSlice";
import { decodeToken } from "../../utils/decodeToken";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Comments = ({ blogId }) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const tokenData = decodeToken(token);

  const { comments, status, error } = useSelector((state) => state.comments);

  const [content, setContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    dispatch(fetchCommentsByBlogId(blogId));
  }, [dispatch, blogId]);

  const handleAddComment = () => {
    dispatch(addComment({ content, blogId }))
      .then(() => {
        toast.success("Yorum başarıyla eklendi. Admin onayı bekleniyor.");
      })
      .catch(() => toast.error(error || "Bir hata oluştu"));
    setContent("");
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setContent(comment.content);
  };

  const handleUpdateComment = () => {
    if (editingComment) {
      dispatch(updateComment({ id: editingComment._id, blogId, content }));
      setEditingComment(null);
      setContent("");
    }
  };

  const handleDeleteComment = (id) => {
    dispatch(deleteComment(id));
  };

  const handleLike = (id) => {
    dispatch(likeComment({ id, blogId }));
  };

  const handleDislike = (id) => {
    dispatch(dislikeComment({ id, blogId }));
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
    <div className="bg-gray-100 p-0 sm:p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        Yorumlar
      </h2>
      {comments?.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white p-4 rounded-lg shadow mb-4"
          >
            <p className="text-gray-700">{comment.content}</p>
            <small className="text-gray-500">
              Yazar: {comment.user.username}
            </small>
            {token && (
              <div className="flex items-center w-full md:w-7/12 lg:w-5/12 xl:w-1/3 gap-0.5 md:gap-4 mt-4">
                {tokenData.username === comment.user.username && (
                  <>
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="w-full py-2 text-xs bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      Güncelle
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="w-full py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Sil
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleLike(comment._id)}
                  className="w-full py-2 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Beğen <span>{comment.likes.length}</span>
                </button>
                <button
                  onClick={() => handleDislike(comment._id)}
                  className="w-full py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Beğenme <span>{comment.dislikes.length}</span>
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">Henüz yorum yapılmamış.</p>
      )}
      {token && (
        <div className="mt-6">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Yorum ekle..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {editingComment ? (
            <button
              onClick={handleUpdateComment}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              Güncelle
            </button>
          ) : (
            <button
              onClick={handleAddComment}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Ekle
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
