import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileComments } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";

const UserComments = () => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfileComments());
  }, [dispatch]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-gray-800 mb-2">{comment.content}</p>
            <p className="text-sm text-gray-600">
              Blog:{" "}
              <Link to={`/blogs/${comment.blog._id}`} className="font-semibold">
                {comment.blog.title}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserComments;
