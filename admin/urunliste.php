<?php 
session_start();
include "../config.php"; 

if(!isset($_SESSION["user"])){
    header("location: ./login.php"); 
    die(); 
}

// SİLME İŞLEMİ (Mermi Gibi Siler)
if(isset($_GET['sil'])){
    $id = $_GET['sil'];
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    header("location: ./urunliste.php?mesaj=silindi");
}

$odalar = $pdo->query("SELECT * FROM products ORDER BY id DESC")->fetchAll();
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <title>Ürün Listesi - Fang Yuan</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <style>
        body { background: #0a0a0f; color: white; font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .status-badge { padding: 2px 10px; border-radius: 50px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .bg-active { background: rgba(26, 255, 26, 0.1); color: #1aff1a; border: 1px solid #1aff1a; }
    </style>
</head>
<body class="p-4 md:p-12">

    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-10">
            <h2 class="text-3xl font-extrabold italic"><i class="fas fa-box-open mr-4 text-blue-500"></i> Mevcut Ürünler</h2>
            <a href="./index.php" class="glass px-6 py-2 rounded-xl text-sm hover:bg-white/10 transition">Geri Dön</a>
        </div>

        <div class="glass rounded-3xl overflow-hidden">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b border-white/10 bg-white/5">
                        <th class="p-6 text-xs uppercase tracking-widest opacity-50">Görsel</th>
                        <th class="p-6 text-xs uppercase tracking-widest opacity-50">Oda Adı</th>
                        <th class="p-6 text-xs uppercase tracking-widest opacity-50">Fiyat</th>
                        <th class="p-6 text-xs uppercase tracking-widest opacity-50">Durum</th>
                        <th class="p-6 text-xs uppercase tracking-widest opacity-50">İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($odalar as $oda): ?>
                    <tr class="border-b border-white/5 hover:bg-white/5 transition">
                        <td class="p-6"><img src="<?php echo $oda['image']; ?>" class="w-20 h-12 object-cover rounded-lg border border-white/10"></td>
                        <td class="p-6 font-bold text-blue-400"><?php echo $oda['title']; ?></td>
                        <td class="p-6 text-sm">₺<?php echo number_format($oda['price'], 0, ',', '.'); ?></td>
                        <td class="p-6"><span class="status-badge bg-active">Aktif</span></td>
                        <td class="p-6">
                            <div class="flex space-x-3">
                                <a href="duzenle.php?id=<?php echo $oda['id']; ?>" class="text-white/50 hover:text-white transition"><i class="fas fa-edit"></i></a>
                                <a href="?sil=<?php echo $oda['id']; ?>" onclick="return confirm('Sileyim mi tostum?')" class="text-red-500/50 hover:text-red-500 transition"><i class="fas fa-trash"></i></a>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>