const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/auth');

// YENİ: Middleware'i çağır
const authenticate = require('../../middlewares/authenticate');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);

// YENİ: Araya 'authenticate' güvenlikçisini koyduk.
// Önce güvenlikçi bakar, geçerse 'ctrl.getCurrent' çalışır.
router.get('/current', authenticate, ctrl.getCurrent);

module.exports = router;