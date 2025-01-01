import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateProfile,
  uploadProfileImage,
} from "../store/slices/authSlice";
import UserBlogs from "../components/profile/UserBlogs";
import UserComments from "../components/profile/UserComments";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("blogs");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", imageFile);
    dispatch(uploadProfileImage(formData));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {user && (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="bg-white shadow-md rounded-md p-6 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kullanıcı Adı:
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Profili Güncelle
                </button>
              </form>
            </div>

            <div className="flex justify-between bg-white shadow-md rounded-md p-6 w-full">
              <div className="flex flex-col justify-between md:space-y-16 w-full">
                <h2 className="text-xl font-bold mb-5">Profile Resmi</h2>
                <form onSubmit={handleImageUpload} className="space-y-4">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  >
                    Resim Yükle
                  </button>
                </form>
              </div>
              {user.profileImage && (
                <img
                  src={`${process.env.REACT_APP_SERVER_URL}${user.profileImage}`}
                  alt="Profile"
                  className="w-24 h-24 md:w-20 md:h-20 lg:w-40 lg:h-40 rounded-full object-cover lg:mr-8"
                />
              )}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("blogs")}
                className={`py-2 px-4 rounded-md font-medium ${
                  activeTab === "blogs"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Bloglarım
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`py-2 px-4 rounded-md font-medium ${
                  activeTab === "comments"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Yorumlarım
              </button>
            </div>
            {activeTab === "blogs" && <UserBlogs />}
            {activeTab === "comments" && <UserComments />}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
