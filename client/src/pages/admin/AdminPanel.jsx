import { useState } from "react";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminBlogs from "../../components/admin/AdminBlogs";
import AdminComments from "../../components/admin/AdminComments";
import AdminDashboard from "./AdminDashboard";
import AdminCategories from "../../components/admin/AdminCategories";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden bg-blue-600 text-white py-2 px-4 shadow-md m-4 rounded-md"
      >
        {menuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
      </button>

      <aside
        className={`md:w-48 bg-blue-600 text-white flex flex-col shadow-lg transform md:transform-none transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:relative inset-y-0 left-0 z-40 w-64`}
      >
        <h1 className="text-center text-xl font-bold py-4 border-b border-blue-500">
          Yönetici Paneli
        </h1>
        <nav className="flex flex-col p-4">
          <button
            onClick={() => {
              setActiveTab("users");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 mb-2 rounded-md text-left ${
              activeTab === "users"
                ? "bg-blue-700"
                : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            Kullanıcı Yönetimi
          </button>
          <button
            onClick={() => {
              setActiveTab("blogs");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 mb-2 rounded-md text-left ${
              activeTab === "blogs"
                ? "bg-blue-700"
                : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            Blog Yönetimi
          </button>
          <button
            onClick={() => {
              setActiveTab("comments");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 mb-2 rounded-md text-left ${
              activeTab === "comments"
                ? "bg-blue-700"
                : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            Yorum Yönetimi
          </button>
          <button
            onClick={() => {
              setActiveTab("categories");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 mb-2 rounded-md text-left ${
              activeTab === "categories"
                ? "bg-blue-700"
                : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            Kategori Yönetimi
          </button>
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setMenuOpen(false);
            }}
            className={`py-2 px-4 mb-2 rounded-md text-left ${
              activeTab === "dashboard"
                ? "bg-blue-700"
                : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            Yönetici Panosu
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 md:ml-0">
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "blogs" && <AdminBlogs />}
        {activeTab === "comments" && <AdminComments />}
        {activeTab === "categories" && <AdminCategories />}
        {activeTab === "dashboard" && <AdminDashboard />}
      </main>
    </div>
  );
};

export default AdminPanel;
