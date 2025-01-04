import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchProfile, logout } from "../store/slices/authSlice";
import { decodeToken } from "../utils/decodeToken";
import { fetchNotifications } from "../store/slices/notificationSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector((state) => state.auth);
  const tokenData = token ? decodeToken(token) : null;

  const { notifications } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              <Link to="/">Blog Uygulaması</Link>
            </h1>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `hidden md:block ml-4 mt-1 text-sm ${
                  isActive && "font-semibold"
                }`
              }
            >
              Bloglar
            </NavLink>
            {token && (
              <NavLink
                to="/blogs/create"
                className={({ isActive }) =>
                  `hidden md:block ml-4 mt-1 text-sm ${
                    isActive && "font-semibold"
                  }`
                }
              >
                Blog Ekle
              </NavLink>
            )}
            {token && tokenData?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `hidden md:block ml-4 mt-1 text-sm ${
                    isActive && "font-semibold"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/notifications"
                  className="relative inline-flex items-center px-2 py-1 text-sm text-blue-600 font-medium bg-white border rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Bildirimler{" "}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -mt-2 -mr-2">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `hidden md:flex items-center justify-center gap-2 ${
                      isActive && "font-semibold"
                    }`
                  }
                >
                  <span>Profil</span>
                  {user?.profileImage && (
                    <img
                      src={`${user.profileImage.url}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm ${isActive && "font-semibold"}`
                  }
                >
                  Giriş Yap
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `text-sm ${isActive && "font-semibold"}`
                  }
                >
                  Kayıt Ol
                </NavLink>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-blue-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                `${isActive && "font-semibold"} text-center block`
              }
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              Bloglar
            </NavLink>
            {token ? (
              <>
                <NavLink
                  to="/blogs/create"
                  className={({ isActive }) =>
                    `${isActive && "font-semibold"} text-center block`
                  }
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Blog Ekle
                </NavLink>
                {tokenData?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `${isActive && "font-semibold"} text-center block`
                    }
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    Admin
                  </NavLink>
                )}
                <Link
                  to="/notifications"
                  className="relative block w-1/4 mx-auto  px-2 py-1 text-sm text-center text-blue-600 font-medium bg-white border rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  Bildirimler{" "}
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -mt-2 -mr-2">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center justify-center gap-2 ${
                      isActive && "font-semibold"
                    }`
                  }
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span>Profil</span>
                  {user?.profileImage && (
                    <img
                      src={`${user.profileImage.url}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-1/2 mx-auto text-center text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-sm"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={({ isActive }) =>
                    `block text-center text-sm py-2 ${
                      isActive && "font-semibold"
                    }`
                  }
                >
                  Giriş Yap
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={({ isActive }) =>
                    `block text-center text-sm py-2 ${
                      isActive && "font-semibold"
                    }`
                  }
                >
                  Kayıt Ol
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
