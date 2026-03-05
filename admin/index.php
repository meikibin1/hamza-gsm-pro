<?php 
session_start();
include "../config.php"; // Veritabanı bağlantı yolun

if(isset($_SESSION["user"])){
    $username = $_SESSION["user"];
} else {
    header("location: ./login.php"); 
    die(); 
} 

// 1. Toplam Oda Sayısı (Resimdeki essek yerine products)
$stmt = $pdo->query("SELECT COUNT(*) FROM products"); 
$rowCount = $stmt->fetchColumn(); 

// 2. Aktif Rezervasyonlar (Basket tablosundan)
$stmt = $pdo->query("SELECT COUNT(*) FROM basket WHERE status = 'Beklemede'"); 
$sepet = $stmt->fetchColumn();

// 3. Sistem Durumu (System tablosundan online kontrolü)
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM products WHERE status = 'Aktif'"); 
    $activeUsers = $stmt->fetchColumn(); // Satıştaki aktif oda sayısı olarak kullandık
} catch(Exception $e) {
    $activeUsers = 0;
} 
?>
<div class="navigation-menu">
    <a href="./index.php" class="nav-item active">
        <i class="fas fa-home"></i>
        <span>Panel Özet</span>
    </a>
    <a href="./rezervasyonlar.php" class="nav-item">
        <i class="fas fa-list"></i>
        <span>Rezervasyonlar</span>
    </a>
    <a href="./oda-ekle.php" class="nav-item">
        <i class="fas fa-plus"></i>
        <span>Yeni Oda Ekle</span>
    </a>
    <a href="./odalar.php" class="nav-item">
        <i class="fas fa-box"></i>
        <span>Oda Listesi</span>
    </a>
    <a href="./ayarlar.php" class="nav-item">
        <i class="fas fa-cog"></i>
        <span>Sistem Ayarları</span>
    </a>
</div>
<a href="./urunekle.php" class="nav-item">
    <i class="fas fa-plus"></i>
    <span>Ürün Ekle</span>
</a>