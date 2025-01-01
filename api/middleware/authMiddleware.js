const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Erişim engellendi, belirteç sağlanmadı" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz Token" });
  }
};

const authenticateAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(403)
      .json({ message: "Erişim engellendi, yetkilendirme başarısız" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Erişim engellendi, yalnızca adminler erişebilir" });
  }

  next();
};

module.exports = { authenticateUser, authenticateAdmin };
