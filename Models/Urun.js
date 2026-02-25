const mongoose = require('mongoose');

const urunSchema = new mongoose.Schema({
    ad: { type: String, required: true },
    fiyat: { type: Number, required: true },
    aciklama: String,
    stok: Number,
    eklenmeTarihi: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Urun', urunSchema);
const Urun = require('./models/Urun'); // Modelimizi çağırdık

// Ürün ekleme rotası (Örnek)
app.post('/urun-ekle', async (req, res) => {
    try {
        const yeniUrun = new Urun({
            ad: req.body.ad,
            fiyat: req.body.fiyat,
            aciklama: req.body.aciklama
        });

        await yeniUrun.save(); // İşte bu satır veriyi buluta kilitler!
        res.send("Ürün başarıyla kaydedildi, artık uçup gitmez.");
    } catch (err) {
        res.status(500).send("Hata oluştu: " + err);
    }
});
app.get('/urunler', async (req, res) => {
    const tumUrunler = await Urun.find(); // Veritabanındaki her şeyi getirir
    res.json(tumUrunler);
});