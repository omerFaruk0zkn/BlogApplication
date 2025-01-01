import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("Başarıyla giriş yaptınız");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Geçersiz kimlik bilgileri");
    }
  };

  if (status === "loading")
    return (
      <ClipLoader
        color="blue"
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
      />
    );

  return (
    <div className="bg-white p-6 sm:p-8 rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3 shadow-md absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Giriş Yap
        </button>
      </form>
      <p className="mt-2">Henüz bir hesabınız yok mu? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Kayıt Ol</Link></p>
    </div>
  );
};

export default LoginPage;
