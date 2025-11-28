const { Schema, model } = require('mongoose');

const diarySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user', // Kullanıcıya bağlı
      required: true,
    },
    date: {
      type: String, // "2025-11-28" formatında tutacağız
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'product', // Hangi yiyecek olduğu
          required: true,
        },
        title: {
            type: String, // Ürün silinse bile adı kalsın diye
            required: true
        },
        weight: {
          type: Number, // Kaç gram yedi
          required: true,
        },
        calories: {
          type: Number, // O porsiyon kaç kalori (Hesaplayıp kaydedeceğiz)
          required: true,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Diary = model('diary', diarySchema);

module.exports = Diary;