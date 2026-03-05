<?php 
session_start();
include "../config.php"; // Veritabanı bağlantısı

// Oturum kontrolü
if(!isset($_SESSION["user"])){
    header("location: ./login.php"); 
    die(); 
}

$message = "";

// FORM GÖNDERİLDİĞİNDE (SQL MÜHÜRLEME)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title   = $_POST['title'];
    $price   = $_POST['price'];
    $view    = $_POST['view'];
    $size    = $_POST['size'];
    $image   = $_POST['image']; // Görsel URL veya Dosya yolu
    $feature = $_POST['feature'];

    try {
        $sql = "INSERT INTO products (title, price, view, size, image, feature, status) 
                VALUES (:title, :price, :view, :size, :image, :feature, 'Aktif')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title'   => $title,
            ':price'   => $price,
            ':view'    => $view,
            ':size'    => $size,
            ':image'   => $image,
            ':feature' => $feature
        ]);
        $message = "success";
    } catch (Exception $e) {
        $message = "error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <title>Ürün Ekle - Fang Yuan</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #0a0a0f 0%, #0f1419 20%, #1a202c 40%, #2d3748 60%, #2c5282 80%, #2b6cb0 100%);
            min-height: 100vh; color: white; font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
        }
        input, textarea, select {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: white !important;
            padding: 12px !important;
            border-radius: 10px !important;
            width: 100%;
        }
        input:focus { border-color: #2b6cb0 !important; outline: none; }
        .btn-add {
            background: linear-gradient(135deg, #2c5282, #2b6cb0);
            transition: 0.3s;
        }
        .btn-add:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(43, 108, 176, 0.4); }
    </style>
</head>
<body class="p-4 md:p-12">

    <div class="max-w-4xl mx-auto">
        <a href="./index.php" class="text-white/50 hover:text-white mb-8 inline-block transition">
            <i class="fas fa-arrow-left mr-2"></i> Panele Geri Dön
        </a>

        <div class="glass-card p-8">
            <h2 class="text-3xl font-extrabold mb-8 flex items-center">
                <i class="fas fa-plus-circle mr-4 text-blue-500"></i> Yeni Ürün/Oda Ekle
            </h2>

            <?php if($message == "success"): ?>
                <div class="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded-xl mb-6">
                    Mermi gibi eklendi! Ürün artık yayında.
                </div>
            <?php endif; ?>

            <form action="" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Oda Başlığı</label>
                    <input type="text" name="title" placeholder="Örn: Azure Royal Suite" required>
                </div>

                <div>
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Gecelik Fiyat (₺)</label>
                    <input type="number" name="price" placeholder="45000" required>
                </div>

                <div>
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Manzara</label>
                    <input type="text" name="view" placeholder="Örn: Panoramik Deniz">
                </div>

                <div>
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Metrekare (Size)</label>
                    <input type="text" name="size" placeholder="Örn: 120m²">
                </div>

                <div class="md:col-span-2">
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Görsel URL</label>
                    <input type="text" name="image" placeholder="https://unsplash.com/photos/..." required>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-xs uppercase opacity-50 mb-2 font-bold tracking-widest">Özellikler & Detaylar</label>
                    <textarea name="feature" rows="4" placeholder="VIP Servis, Özel Jakuzi, Akıllı Ev Sistemi..."></textarea>
                </div>

                <div class="md:col-span-2 mt-4">
                    <button type="submit" class="btn-add w-full py-4 rounded-xl font-bold uppercase tracking-widest">
                        <i class="fas fa-save mr-2"></i> Veritabanına Mühürle
                    </button>
                </div>

            </form>
        </div>
    </div>

</body>
</html>