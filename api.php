<?php
// =============================================
// diLA Tech — Backend API
// Handles Apps, Stats, Premium Settings, and Reviews
// =============================================

require_once 'db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // Fetch all apps
    if ($action === 'get_apps') {
        $stmt = $pdo->query("SELECT data FROM apps");
        $apps = [];
        while ($row = $stmt->fetch()) {
            $apps[] = json_decode($row['data'], true);
        }
        echo json_encode($apps);
    }
    
    // Fetch specific site data (stats, premium, reviews)
    else if ($action === 'get_site_data') {
        $key = $_GET['key'] ?? '';
        $stmt = $pdo->prepare("SELECT data_value FROM site_data WHERE data_key = ?");
        $stmt->execute([$key]);
        $row = $stmt->fetch();
        echo $row ? $row['data_value'] : json_encode(null);
    }
} 

else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }

    // Save/Update Apps
    if ($action === 'save_apps') {
        // Clear old apps and insert new ones (Simplest way to sync)
        $pdo->exec("DELETE FROM apps");
        $stmt = $pdo->prepare("INSERT INTO apps (id, data) VALUES (?, ?)");
        foreach ($input as $app) {
            $stmt->execute([$app['id'], json_encode($app)]);
        }
        echo json_encode(['success' => true]);
    }

    // Save/Update Site Data (stats, premium, reviews)
    else if ($action === 'save_site_data') {
        $key = $_GET['key'] ?? '';
        $stmt = $pdo->prepare("INSERT INTO site_data (data_key, data_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE data_value = VALUES(data_value)");
        $stmt->execute([$key, json_encode($input)]);
        echo json_encode(['success' => true]);
    }
}
?>
