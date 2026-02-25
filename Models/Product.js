const mongoose = require('mongoose');

const urunSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 'ad' yerine 'title' yaptık
    price: { type: Number, required: true }, // 'fiyat' yerine 'price' yaptık
    category: String, // Panelde kategori sütunu olduğu için ekledik
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Urun', urunSchema);