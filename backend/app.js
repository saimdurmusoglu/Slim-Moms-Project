const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// 1. Router'ı çağır (Dosya yoluna dikkat: ./src/...)
const authRouter = require('./src/routes/api/auth');
const dailyRateRouter = require('./src/routes/api/daily-rate');
const productsRouter = require('./src/routes/api/products');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

// 2. Middleware'leri yükle
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// 3. ROTALARI BAĞLA (En Kritik Yer Burası!)
// Bu satır, 404 hatasından ÖNCE olmalı.
app.use('/api/auth', authRouter);
app.use('/api/daily-rate', dailyRateRouter);
app.use('/api/products', productsRouter);

// Test Rotası (Tarayıcıdan kontrol için)
app.get('/', (req, res) => {
  res.send("Slim Moms Backend Çalışıyor! 🚀");
});

// 4. Hata Yönetimi (Bunlar en sonda olmalı)
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;