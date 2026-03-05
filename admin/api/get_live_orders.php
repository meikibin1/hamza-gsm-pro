<?php
include "../../config.php";
header('Content-Type: application/json');

$stmt = $pdo->query("SELECT * FROM basket ORDER BY id DESC LIMIT 15");
$orders = $stmt->fetchAll();

echo json_encode($orders);
?>