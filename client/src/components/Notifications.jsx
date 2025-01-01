import { useDispatch, useSelector } from "react-redux";
import { markAsRead } from "../store/slices/notificationSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, status, error } = useSelector(
    (state) => state.notifications
  );

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Bildirimler</h2>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg shadow-md ${
                notification.isRead
                  ? "bg-green-300 border border-gray-300"
                  : "bg-red-300 border border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{notification.message}</p>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Okundu olarak işaretle
                  </button>
                )}
              </div>
              <small className="text-gray-600 text-sm">
                {new Date(notification.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Bildirim bulunamadı.</p>
      )}
    </div>
  );
};

export default Notifications;
