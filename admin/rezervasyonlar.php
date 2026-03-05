<?php 
session_start();
include "../config.php"; 
if(!isset($_SESSION["user"])){ header("location: ./login.php"); die(); }
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <title>Canlı Rezervasyonlar - Fang Yuan</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
    <style>
        body { background: #0a0a0f; color: white; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .live-pulse { width: 10px; height: 10px; background: #1aff1a; border-radius: 50%; display: inline-block; margin-right: 10px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(26, 255, 26, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(26, 255, 26, 0); } 100% { box-shadow: 0 0 0 0 rgba(26, 255, 26, 0); } }
        .new-row { animation: slideIn 0.5s ease-out; background: rgba(43, 108, 176, 0.1); }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    </style>
</head>
<body class="p-6 md:p-12">

    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-10">
            <div>
                <h2 class="text-3xl font-extrabold italic"><i class="fas fa-satellite-dish mr-4 text-blue-500"></i> Rezervasyon Radarı</h2>
                <p class="text-xs opacity-50 mt-2"><span class="live-pulse"></span> Sistem şu an canlı olarak yeni kayıtları tarıyor...</p>
            </div>
            <a href="./index.php" class="glass px-6 py-2 rounded-xl text-sm hover:bg-white/10 transition">Geri Dön</a>
        </div>

        <div class="glass rounded-3xl overflow-hidden">
            <table class="w-full text-left" id="reservationTable">
                <thead>
                    <tr class="border-b border-white/10 bg-white/5">
                        <th class="p-6 text-xs uppercase opacity-50">Tarih</th>
                        <th class="p-6 text-xs uppercase opacity-50">Müşteri</th>
                        <th class="p-6 text-xs uppercase opacity-50">Telefon</th>
                        <th class="p-6 text-xs uppercase opacity-50">Oda ID</th>
                        <th class="p-6 text-xs uppercase opacity-50">Durum</th>
                    </tr>
                </thead>
                <tbody id="liveData">
                    </tbody>
            </table>
        </div>
    </div>

    <script>
        function fetchReservations() {
            fetch('./api/get_live_orders.php')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('liveData');
                let rows = '';
                data.forEach(order => {
                    rows += `
                    <tr class="border-b border-white/5 hover:bg-white/5 transition">
                        <td class="p-6 text-xs opacity-70">${order.created_at}</td>
                        <td class="p-6 font-bold text-blue-400">${order.customer_name}</td>
                        <td class="p-6 text-sm">${order.customer_phone}</td>
                        <td class="p-6 text-xs opacity-60">#${order.product_id}</td>
                        <td class="p-6"><span class="px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-400 text-[10px] rounded-full uppercase font-bold">${order.status}</span></td>
                    </tr>`;
                });
                tbody.innerHTML = rows;
            });
        }

        // 3 Saniyede bir radarı tara
        setInterval(fetchReservations, 3000);
        fetchReservations(); // İlk yüklemede çalıştır
    </script>
</body>
</html>