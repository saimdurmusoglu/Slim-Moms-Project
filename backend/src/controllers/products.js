const Product = require('../models/Product');

const getProductsByQuery = async (req, res, next) => {
  try {
    const { search } = req.query; // URL'den ?search=elma diye gelen veriyi al

    // Eğer arama boşsa hata döndürmeyelim, boş liste dönelim
    if (!search) {
      return res.status(400).json({ message: "Search query is missing" });
    }

    // MongoDB'de Regex ile arama (Büyük/küçük harf duyarsız 'i')
    const result = await Product.find({
      'title.en': { $regex: search, $options: 'i' },
    });

    res.json({
      status: 'success',
      code: 200,
      data: {
        result, // Bulunan ürünler
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductsByQuery,
};