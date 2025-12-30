<?php
require 'cors.php';
require 'db.php';

if (!isset($_SESSION['user_id'])) { 
    echo json_encode(['error' => 'No autorizado']); 
    exit; 
}

$userId = $_SESSION['user_id'];
$action = $_POST['action'] ?? '';

if ($action === 'load') {
    $stmt = $pdo->prepare("SELECT * FROM habits WHERE user_id = ? AND year = '2026'");
    $stmt->execute([$userId]);
    $habits = $stmt->fetchAll();

    $response = [];
    $stmtChecks = $pdo->prepare("SELECT check_date FROM habit_checks WHERE habit_id = ?");

    foreach ($habits as $habit) {
        $stmtChecks->execute([$habit['id']]);
        $checks = $stmtChecks->fetchAll(PDO::FETCH_COLUMN);
        
        $response[$habit['id']] = [
            'id'       => $habit['id'],
            'name'     => $habit['name'],
            'category' => $habit['category'],
            'color'    => $habit['color'],
            'checks'   => $checks
        ];
    }
    echo json_encode($response ?: (object)[]);
} 
elseif ($action === 'add_habit') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $color = $_POST['color'];

    $stmt = $pdo->prepare("INSERT INTO habits (user_id, name, category, color, year) VALUES (?, ?, ?, ?, '2026')");
    $result = $stmt->execute([$userId, $name, $category, $color]);
    echo json_encode(['success' => $result]);
} 
elseif ($action === 'toggle_check') {
    $habitId = $_POST['habitId'];
    $date = $_POST['date'];

    $stmtVerify = $pdo->prepare("SELECT id FROM habits WHERE id = ? AND user_id = ?");
    $stmtVerify->execute([$habitId, $userId]);
    
    if ($stmtVerify->rowCount() > 0) {
        $stmtCheck = $pdo->prepare("SELECT id FROM habit_checks WHERE habit_id = ? AND check_date = ?");
        $stmtCheck->execute([$habitId, $date]);
        $existingCheck = $stmtCheck->fetch();

        if ($existingCheck) {
            $stmtDel = $pdo->prepare("DELETE FROM habit_checks WHERE id = ?");
            $stmtDel->execute([$existingCheck['id']]);
        } else {
            $stmtIns = $pdo->prepare("INSERT INTO habit_checks (habit_id, check_date) VALUES (?, ?)");
            $stmtIns->execute([$habitId, $date]);
        }
    }
    echo json_encode(['success' => true]);
}
?>
