const mongoose = require('mongoose');
const Product = require('./src/models/Product');
require('dotenv').config();

const { DB_HOST } = process.env;

// Örnek Yiyecekler
const products = [
  { title: { en: "Egg" }, calories: 155, groupBloodNotAllowed: [null, true, false, false, false] },
  { title: { en: "Milk" }, calories: 42, groupBloodNotAllowed: [null, true, true, false, true] },
  { title: { en: "Banana" }, calories: 89, groupBloodNotAllowed: [null, false, false, true, false] },
  { title: { en: "Bread" }, calories: 265, groupBloodNotAllowed: [null, true, false, true, false] },
  { title: { en: "Chicken Breast" }, calories: 165, groupBloodNotAllowed: [null, false, true, false, false] },
  { title: { en: "Apple" }, calories: 52, groupBloodNotAllowed: [null, false, false, false, false] },
  { title: { en: "Cheese" }, calories: 402, groupBloodNotAllowed: [null, true, true, false, false] },
  { title: { en: "Chocolate" }, calories: 546, groupBloodNotAllowed: [null, false, true, true, true] },
  { title: { en: "Rice" }, calories: 130, groupBloodNotAllowed: [null, true, false, false, true] },
  { title: { en: "Potato" }, calories: 77, groupBloodNotAllowed: [null, false, false, true, true] },
];

mongoose.set('strictQuery', true);

mongoose
  .connect(DB_HOST)
  .then(async () => {
    console.log("✅ Database connected. Seeding starting...");
    
    // Önce temizle (varsa eski verileri sil)
    await Product.deleteMany();
    
    // Yeni verileri ekle
    await Product.insertMany(products);
    
    console.log("✅ 10 products added successfully!");
    process.exit();
  })
  .catch((error) => {
    console.log("❌ Error:", error.message);
    process.exit(1);
  });