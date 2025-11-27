const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // YENİ
const User = require('../models/User');
require('dotenv').config(); // YENİ

const { SECRET_KEY } = process.env; // .env'den anahtarı al

// --- REGISTER (Zaten Vardı) ---
const register = async (req, res, next) => {
    // ... burası aynen kalsın, dokunma ...
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) { return res.status(409).json({ message: "Email in use" }); }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashPassword });
        res.status(201).json({ status: "success", code: 201, data: { user: { name: newUser.name, email: newUser.email } } });
    } catch (error) { next(error); }
};

// --- LOGIN (YENİ EKLİYORUZ) ---
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Kullanıcı var mı?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        // 2. Şifre doğru mu?
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(401).json({ message: "Email or password is wrong" });
        }

        // 3. Token Oluştur (İmza At)
        const payload = {
            id: user._id,
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' }); // 23 saat geçerli

        // 4. Token'ı Veritabanına da kaydet (Logout işlemi için gerekli olacak)
        await User.findByIdAndUpdate(user._id, { token });

        // 5. Yanıt Dön
        res.json({
            status: "success",
            code: 200,
            data: {
                token,
                user: {
                    name: user.name,
                    email: user.email,
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

const getCurrent = async (req, res) => {
  const { name, email, userData } = req.user; // req.user'ı middleware'den aldık

  res.json({
    status: "success",
    code: 200,
    data: {
      name,
      email,
      userData // Kullanıcının boy/kilo bilgilerini de görelim
    },
  });
};

// --- EXPORT ---
module.exports = {
    register,
    login,
    getCurrent, // Bunu dışarı açmayı unutma!
};