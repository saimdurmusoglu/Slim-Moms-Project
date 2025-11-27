const calculateDailyRate = (currentWeight, height, age, desiredWeight) => {
  // Mifflin-St Jeor Formülü (Kadınlar için standart)
  // Formül: (10 x kilo) + (6.25 x boy) - (5 x yaş) - 161
  const bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;

  // Sonucu yuvarlayıp döndür
  return Math.round(bmr);
};

module.exports = calculateDailyRate;