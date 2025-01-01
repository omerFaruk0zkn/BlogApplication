import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  fetchUsers,
  updateUserRole,
} from "../../store/slices/adminSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm("Kullanıcı silmek istediğinizden emin misiniz?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, role: newRole }));
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
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Yönetici Kullanıcılar Paneli
        </h2>
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex flex-wrap justify-between items-center py-4 px-2 gap-4"
            >
              <div>
                <p className="text-gray-800 font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Rol: {user.role}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <button
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition text-sm sm:text-base"
                >
                  Admin Yap
                </button>
                <button
                  onClick={() => handleRoleChange(user._id, "user")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition text-sm sm:text-base"
                >
                  Kullanıcı Yap
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition text-sm sm:text-base"
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminUsers;
