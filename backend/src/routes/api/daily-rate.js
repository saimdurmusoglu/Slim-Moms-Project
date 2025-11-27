const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/daily-rate');
const authenticate = require('../../middlewares/authenticate'); // Güvenlikçiyi çağır

// Public: Herkes hesaplayabilir (Kaydetmez)
router.post('/', ctrl.getDailyRate);

// Private: Sadece üyeler hesaplayabilir (Kullanıcıya kaydeder)
// URL: /api/daily-rate/user/123... (ID'yi URL'den de alabiliriz ama Token daha güvenli)
// Biz burada ID parametresini URL'de zorunlu tutulan proje yapısına uyalım:
router.post('/user/:id', authenticate, ctrl.getDailyRateUser);

module.exports = router;