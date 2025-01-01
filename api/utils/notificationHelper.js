const Notification = require("../models/Notification");

const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    await notification.save();
  } catch (error) {
    console.error("Bildirim oluşturulurken hata oluştu:", error);
  }
};

module.exports = { createNotification };
