import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchTimeBasedStats,
  fetchTrendReports,
} from "../../store/slices/adminDashboardSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, trends, activity } = useSelector(
    (state) => state.adminDashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchTrendReports());
    dispatch(fetchTimeBasedStats());
  }, [dispatch]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Yönetici Panosu
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stats && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Genel İstatistikler
            </h2>
            <p className="text-gray-600">
              Toplam Kullanıcılar:{" "}
              <span className="font-bold">{stats.userCount}</span>
            </p>
            <p className="text-gray-600">
              Toplam Bloglar:{" "}
              <span className="font-bold">{stats.blogCount}</span>
            </p>
            <p className="text-gray-600">
              Toplam Yorumlar:{" "}
              <span className="font-bold">{stats.commentCount}</span>
            </p>
          </div>
        )}

        {trends && (
          <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Trend Raporları
            </h2>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-600">
                En Çok Yorum Alan Bloglar
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {trends.mostCommentedBlogs.map((blog) => (
                  <li key={blog._id} className="my-1">
                    {blog.title} -{" "}
                    <span className="font-bold">{blog.commentCount}</span> yorum
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-600">
                En Beğenilen Bloglar
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {trends.mostLikedBlogs.map((blog) => (
                  <li key={blog._id} className="my-1">
                    {blog.title} -{" "}
                    <span className="font-bold">{blog.likes.length}</span>{" "}
                    beğeni
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-600">
                En Çok Görüntülenen Bloglar
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {trends.mostViewedBlogs.map((blog) => (
                  <li key={blog._id} className="my-1">
                    {blog.title} -{" "}
                    <span className="font-bold">{blog.views}</span> görüntülenme
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activity && (
          <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Etkinlikler
            </h2>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-600">
                Günlük Blog Etkinliği
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {activity.dailyBlogActivity.map((day) => (
                  <li key={day._id} className="my-1">
                    {day._id}: <span className="font-bold">{day.count}</span>{" "}
                    blog
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-600">
                Günlük Yorum Etkinliği
              </h3>
              <ul className="list-disc list-inside text-gray-600">
                {activity.dailyCommentActivity.map((comment) => (
                  <li key={comment._id} className="my-1">
                    {comment._id}:{" "}
                    <span className="font-bold">{comment.count}</span> yorum
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
