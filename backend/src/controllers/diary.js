const Diary = require('../models/Diary');
const Product = require('../models/Product');

// --- 1. YİYECEK EKLEME (ADD) ---
const addProduct = async (req, res, next) => {
  try {
    const { _id: userId } = req.user; // Giriş yapmış kullanıcı ID'si
    const { date, productId, weight } = req.body; // Frontend'den gelenler

    // 1. Ürünü bul (Kalorisi lazım)
    const productInfo = await Product.findById(productId);
    if (!productInfo) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Kaloriyi Hesapla ( (Ürün Kalorisi / 100) * Yenen Gramaj )
    const calories = Math.round((productInfo.calories / 100) * weight);

    // 3. O tarihte bu kullanıcının bir günlüğü var mı?
    let diary = await Diary.findOne({ owner: userId, date });

    // 4. Yoksa yeni oluştur
    if (!diary) {
      diary = await Diary.create({
        owner: userId,
        date,
        products: [],
      });
    }

    // 5. Ürünü listeye ekle
    diary.products.push({
      product: productId,
      title: productInfo.title.en, // İngilizce ismini kaydedelim
      weight,
      calories,
    });

    await diary.save(); // Kaydet

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        addedProduct: {
          product: productId,
          weight,
          calories,
        },
        diary, // Güncel günlüğü dön
      },
    });

  } catch (error) {
    next(error);
  }
};

// --- 2. YİYECEK SİLME (DELETE) ---
const removeProduct = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { diaryId, productId } = req.params; // URL'den gelecek

    // Günlüğü bul ve içindeki products dizisinden o ürünü çıkar ($pull)
    const result = await Diary.findByIdAndUpdate(
      diaryId,
      {
        $pull: { products: { _id: productId } }, // DİKKAT: Array içindeki ID'ye göre siliyoruz
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    res.json({
      status: 'success',
      code: 200,
      message: "Product deleted",
      data: {
        diary: result,
      }
    });

  } catch (error) {
    next(error);
  }
};

// --- 3. GÜN BİLGİSİNİ GETİR (GET INFO) ---
const getDayInfo = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { date } = req.body; // Frontend tarihi göndersin: "2025-11-28"

    const diary = await Diary.findOne({ owner: userId, date });

    if (!diary) {
        // Eğer o gün kayıt yoksa boş dönebiliriz
        return res.json({
            status: 'success',
            code: 200,
            data: {
                products: [], // Boş liste
                date
            }
        });
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        products: diary.products,
        date: diary.date,
        _id: diary._id
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  removeProduct,
  getDayInfo,
};