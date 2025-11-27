const { Schema, model } = require('mongoose');

// Kullanıcı Şeması
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // İsim zorunlu
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Aynı mail ile ikinci kez kayıt olunamaz
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6, // En az 6 karakter olsun
    },
    token: {
      type: String,
      default: null, // Giriş yapınca dolacak
    },
    // --- Slim Moms Özel Alanları ---
    // Kullanıcının fiziksel özellikleri ve hedefleri
    userData: {
      height: {
        type: Number,
        default: null, // 0 yerine null yapalım, 'min' kuralını sildik
      },
      age: {
        type: Number,
        default: null, // 'min' kuralını sildik
      },
      currentWeight: {
        type: Number,
        default: null,
      },
      desiredWeight: {
        type: Number,
        default: null,
      },
      bloodType: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1,
      },
      dailyRate: {
        type: Number,
        default: 0,
      },
      notAllowedProducts: {
        type: [String],
        default: [],
      },
    },
  },
  { versionKey: false, timestamps: true }
);

// Hataları yönetmek için bir "post save" hook (Opsiyonel ama iyi pratiktir)
userSchema.post("save", (error, data, next) => {
  const { name, code } = error;
  if (name === "MongoServerError" && code === 11000) {
    error.status = 409; // Conflict (Çakışma) hatası
  } else {
    error.status = 400; // Bad Request
  }
  next();
});

const User = model('user', userSchema);

module.exports = User;