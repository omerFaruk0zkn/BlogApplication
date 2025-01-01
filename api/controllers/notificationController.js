const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Bildirimler getirilirken bir hata oluştu" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Bildirim bulunamadı" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Bildirim okundu olarak işaretlendi" });
  } catch (error) {
    res.status(500).json({ message: "Bildirim okunurken bir hata oluştu" });
  }
};
