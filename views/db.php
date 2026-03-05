<?php
// OFO HOTEL - KRİTİK BAĞLANTI AYARLARI
$host     = 'localhost';
$dbname   = 'u976935047_otel'; // DB Adın
$username = 'u976935047_otel'; // Kullanıcı Adın
$password = '=8P7L|#|8to';    // Yeni Şifren
$charset  = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

try {
    // Kule kapıları açılıyor...
    $db = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    // Hata olursa burada patlarız
    die("Kule Bağlantı Hatası: Bilgileri kontrol et tostum! " . $e->getMessage());
}
?>