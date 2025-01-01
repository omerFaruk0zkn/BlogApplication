import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { status, error } = useSelector((state) => state.auth);
console.log(error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("Başarıyla kayıt oldunuz");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Bir şeyler ters gitti");
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
            Kullanıcı Adı
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
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
          Kayıt Ol
        </button>
      </form>
      <p className="mt-2">
        Zaten bir hesabınız var mı?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
