const User = require('../models/User'); // <-- Eksik olan parça buydu!
const Product = require('../models/Product');
const calculateDailyRate = require('../helpers/calculator');

// 1. Public: Sadece Hesapla (Kaydetme)
const getDailyRate = async (req, res, next) => {
  try {
    const { height, age, currentWeight, desiredWeight, bloodType } = req.body;

    const dailyRate = calculateDailyRate(currentWeight, height, age, desiredWeight);

    const forbiddenProducts = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true,
    });

    const notAllowedProducts = forbiddenProducts.map(p => p.title.en).slice(0, 5);

    res.json({
      status: 'success',
      code: 200,
      data: {
        dailyRate,
        notAllowedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 2. Private: Hesapla ve Kullanıcıya Kaydet
const getDailyRateUser = async (req, res, next) => {
  try {
    const { id } = req.user; // Token'dan gelen ID
    const { height, age, currentWeight, desiredWeight, bloodType } = req.body;

    const dailyRate = calculateDailyRate(currentWeight, height, age, desiredWeight);

    const forbiddenProducts = await Product.find({
      [`groupBloodNotAllowed.${bloodType}`]: true,
    });
    
    const notAllowedProducts = forbiddenProducts.map(p => p.title.en).slice(0, 5);

    // Kullanıcıyı güncelle
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        userData: {
          height,
          age,
          currentWeight,
          desiredWeight,
          bloodType,
          dailyRate,
          notAllowedProducts,
        },
      },
      { new: true }
    );

    res.json({
      status: 'success',
      code: 200,
      data: {
        user: updatedUser,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyRate,
  getDailyRateUser,
};