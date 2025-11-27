const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/products');
const authenticate = require('../../middlewares/authenticate');

// Sadece giriş yapmış kullanıcılar arama yapabilsin
router.get('/', authenticate, ctrl.getProductsByQuery);

module.exports = router;