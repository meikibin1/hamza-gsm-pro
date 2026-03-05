<?php 
// 1. KULE BAĞLANTISI (Yolunu kontrol et!)
include "sadece-online-ozel/inc/db.php"; 

try {
    // 2. SİSTEM AYARLARINI ÇEK (Otel İsmi vb.)
    $stmt = $db->query("SELECT * FROM system LIMIT 1");
    $ayarlar = $stmt->fetch();

    // 3. AKTİF ODALARI ÇEK
    $stmt = $db->query("SELECT * FROM products WHERE status = 'Aktif' ORDER BY id DESC");
    $odalar = $stmt->fetchAll();
} catch (Exception $e) {
    die("Kule Hatası: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title><?php echo $ayarlar['hotel_name'] ?? 'OFO HOTEL'; ?> | Ultra Luxury</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { background: #050505; color: #fff; font-family: 'Inter', sans-serif; }
        .serif { font-family: 'Cinzel', serif; }
        .gold { color: #D4AF37; }
        .room-card { border: 1px solid rgba(255,255,255,0.05); transition: 0.5s; background: #0a0a0a; }
        .room-card:hover { border-color: #D4AF37; transform: translateY(-10px); }
    </style>
</head>
<body>

    <nav class="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
        <div class="serif text-2xl gold tracking-[0.3em] font-bold"><?php echo $ayarlar['hotel_name'] ?? 'OFO HOTEL'; ?></div>
        <div class="gold text-sm font-bold"><?php echo $ayarlar['hotel_phone'] ?? '+90 242 000 00 00'; ?></div>
    </nav>

    <header class="h-[60vh] flex items-center justify-center text-center relative">
        <div class="relative z-10">
            <h1 class="text-6xl md:text-8xl serif italic mb-4">Saf <span class="gold">Prestij</span></h1>
            <p class="uppercase tracking-[1em] opacity-40 text-xs">Antalya'nın Zirvesi</p>
        </div>
    </header>

    <main class="max-w-7xl mx-auto py-20 px-6">
        <h2 class="text-3xl serif italic mb-12 border-l-4 border-gold pl-6">Özel <span class="gold">Koleksiyon</span></h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <?php if(count($odalar) > 0): ?>
                <?php foreach($odalar as $oda): ?>
                <div class="room-card rounded-3xl overflow-hidden p-6">
                    <img src="<?php echo $oda['image'] ?? 'https://images.unsplash.com/photo-1566665797739-1674de7a421a'; ?>" class="rounded-2xl mb-6 h-60 w-full object-cover border border-white/5">
                    <h3 class="serif text-xl gold mb-4"><?php echo $oda['title']; ?></h3>
                    <div class="flex justify-between items-center mb-6">
                        <span class="opacity-40 text-[10px] uppercase tracking-widest"><?php echo $oda['view']; ?> | <?php echo $oda['size']; ?></span>
                        <span class="gold font-bold">₺<?php echo number_format($oda['price'], 0, ',', '.'); ?></span>
                    </div>
                    <a href="rezervasyon.php?id=<?php echo $oda['id']; ?>" class="block text-center border border-white/10 py-4 text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition duration-500 rounded-xl">Hemen Ayırt</a>
                </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p class="col-span-3 text-center opacity-30 italic">Henüz oda eklenmemiş tostum, admin panelinden mühürle!</p>
            <?php endif; ?>
        </div>
    </main>

</body>
</html>