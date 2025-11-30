const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/diary');
const authenticate = require('../../middlewares/authenticate');

// Tüm işlemler için giriş yapmış olmak şart
router.use(authenticate);

// 1. Günlük Bilgisi Getir (POST kullanıyoruz çünkü tarihi body'de göndermek daha kolay)
router.post('/day', ctrl.getDayInfo);

// 2. Yiyecek Ekle
router.post('/add', ctrl.addProduct);

// 3. Yiyecek Sil (:diaryId günlüğün ID'si, :productId ise satırın ID'si)
router.delete('/:diaryId/:productId', ctrl.removeProduct);

// 4. Ürün Güncelleme (PATCH metodu kullanılır)
// URL: /api/diary/update/:productId
router.patch('/update/:productId', ctrl.updateProduct);

module.exports = router;