import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveComment,
  deleteComment,
  fetchAllComments,
} from "../../store/slices/adminSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import AdminCommentFilter from "./AdminCommentFilter";

const AdminComments = () => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  const handleDelete = (commentId) => {
    if (window.confirm("Yorumu silmek istediğinize emin misiniz ?")) {
      dispatch(deleteComment(commentId));
    }
  };

  const handleApprove = (commentId) => {
    dispatch(approveComment(commentId));
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        Yönetici Yorumlar Paneli
      </h3>
      <AdminCommentFilter />
      {comments?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="border p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700 mb-2">{comment.content}</p>
              <small className="text-gray-500 mb-2 flex flex-col">
                <span className="font-medium md:text-xs">
                  Email: {comment.user.email}
                </span>
                <span
                  className={`font-medium ${
                    comment.approved ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Onaylanmış: {comment.approved ? "Evet" : "Hayır"}
                </span>
              </small>
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
                {!comment.approved && (
                  <button
                    onClick={() => handleApprove(comment._id)}
                    className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
                  >
                    Onayla
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm sm:text-base"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500 text-lg font-semibold">Henüz yorum yok</p>
      )}
    </div>
  );
};

export default AdminComments;
