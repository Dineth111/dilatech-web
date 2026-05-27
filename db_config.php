<?php
// =============================================
// diLA Tech — Database Configuration
// =============================================

$host = 'sql205.infinityfree.com';
$db = 'if0_41717323_dilatech';
$user = 'if0_41717323';
$pass = 'p3VcCmnkkwi'; // <--- OYAAGE MYSQL PASSWORD EKA METHERATA DANNA
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
     PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
     PDO::ATTR_EMULATE_PREPARES => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     header('Content-Type: application/json');
     echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
     exit;
}