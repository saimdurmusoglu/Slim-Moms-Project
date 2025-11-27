const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  // 1. Token nerede? (Header'da "Authorization" kısmında gelir)
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  // 2. Token formatı doğru mu? ("Bearer <token>" şeklinde olmalı)
  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    // 3. Token geçerli mi? (Sahte mi, süresi dolmuş mu?)
    const { id } = jwt.verify(token, SECRET_KEY);

    // 4. Bu ID'ye sahip kullanıcı veritabanında var mı?
    const user = await User.findById(id);

    // Kullanıcı yoksa veya token'ı silinmişse (Logout olmuşsa)
    if (!user || !user.token || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 5. Her şey yolunda! Kullanıcı bilgisini pakete ekle ve devam et.
    req.user = user; 
    next();

  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authenticate;