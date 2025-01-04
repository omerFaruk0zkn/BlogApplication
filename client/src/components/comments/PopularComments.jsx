import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularComments } from "../../store/slices/commentSlice";
import { toast } from "react-toastify";

const PopularComments = ({ blogId }) => {
  const dispatch = useDispatch();
  const { popularComments, status, error } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    dispatch(fetchPopularComments(blogId));
  }, [dispatch, blogId]);

  if (status === "failed") return toast.error(error);

  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-6">
      <h3 className="text-lg md:text-xl font-semibold to-gray-800 mb-4 border-b border-b-black pb-2">
        Popüler Yorumlar
      </h3>
      {popularComments?.length > 0 ? (
        popularComments.map((comment) => (
          <div
            key={comment._id}
            className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
          >
            <p className="text-gray-700 text-base mb-2">{comment.content}</p>
            <small className="text-gray-600 text-sm flex justify-between items-center">
              <span>Yazar: {comment.user.username}</span>
              <span>Beğeniler: {comment.likes.length}</span>
            </small>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Henüz popüler bir yorum yok.</p>
      )}
    </div>
  );
};

export default PopularComments;
