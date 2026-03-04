const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'ofo2026', resave: false, saveUninitialized: true }));

// --- ROTALAR ---

// 1. Admin Giriş Kapısı
app.get('/m2000-panel', (req, res) => {
    res.render('admin_login', { error: null }); 
});

// 2. Giriş Kontrol
app.post('/admin-login-check', (req, res) => {
    if (req.body.password === "123456") {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin_login', { error: 'Hatalı Parola!' });
    }
});

// 3. Admin Paneli (Kilitli)
app.get('/admin', async (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/m2000-panel');
    try {
        const [rooms] = await db.query("SELECT * FROM rooms ORDER BY id DESC");
        res.render('admin/index', { rooms });
    } catch (err) {
        res.send("DB Bağlantı Hatası: " + err.message);
    }
});

// 4. Müşteri Ana Sayfası
app.get('/', async (req, res) => {
    try {
        const [odalar] = await db.query("SELECT * FROM rooms WHERE status = 1");
        res.render('index', { odalar });
    } catch (err) {
        res.render('index', { odalar: [] });
    }
});
app.get('/rezervasyon/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);
        if (rows.length > 0) {
            res.render('checkout', { oda: rows[0] }); // checkout.ejs'yi çağır
        } else {
            res.redirect('/');
        }
    } catch (err) {
        res.redirect('/');
    }
});

app.listen(3000, () => console.log("🚀 Kule 3000. katta yayında!"));