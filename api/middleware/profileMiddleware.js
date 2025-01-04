const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Sadece JPEG ve PNG formatındaki dosyalar yüklenebilir."));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
