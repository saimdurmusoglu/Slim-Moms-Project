const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    title: {
      type: Object, // { en: "Egg", ru: "...", ua: "..." } şeklinde tutulur genelde
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      default: 100,
    },
    // En kritik kısım: Hangi kan grubuna yasak?
    // [null, 1.Grup, 2.Grup, 3.Grup, 4.Grup]
    // true = yasak, false = serbest
    groupBloodNotAllowed: {
      type: [Boolean],
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Product = model('product', productSchema);

module.exports = Product;