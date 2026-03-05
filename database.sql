-- OFO HOTEL & TOWER - DATABASE STRUCTURE
-- Version 1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

-- --------------------------------------------------------
-- 1. ODALAR TABLOSU (Premium Modüller)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `view` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `feature` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1 COMMENT '1: Aktif, 0: Bakimda',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. REZERVASYONLAR TABLOSU (Müşteri Talepleri)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` int(11) NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Beklemede',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TEST VERİSİ (Vitrinde Şık Dursun)
-- --------------------------------------------------------
INSERT INTO `rooms` (`title`, `price`, `size`, `view`, `feature`, `image`, `status`) VALUES
('Azure Royal Suite', 35000.00, '120', 'Kesintisiz Akdeniz', 'Kişisel Butler, Teras Jakuzi, VIP Havalimanı Transferi', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200', 1),
('Onyx Executive Room', 18500.00, '65', 'Şehir & Deniz Panoramik', 'Akıllı Ev Sistemi, Premium Minibar, Çalışma Alanı', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200', 1);

-- --------------------------------------------------------
-- İLİŞKİLER (Foreign Keys)
-- --------------------------------------------------------
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE;

COMMIT;