<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user'])) { echo json_encode(['error' => 'No autorizado']); exit; }

$user = $_SESSION['user'];
$file = 'data/habits_data.json';

if (!file_exists($file)) { file_put_contents($file, json_encode([])); }
$data = json_decode(file_get_contents($file), true);

// Estructura: $data[usuario][año][habito_id] = { info: {...}, checks: [ "2026-01-01", ... ] }
if (!isset($data[$user])) { $data[$user] = ['2026' => []]; }

$action = $_POST['action'] ?? '';

if ($action === 'load') {
    echo json_encode($data[$user]['2026']);
} 
elseif ($action === 'add_habit') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $color = $_POST['color'];
    $id = uniqid();
    
    $data[$user]['2026'][$id] = [
        'id' => $id,
        'name' => $name,
        'category' => $category,
        'color' => $color,
        'checks' => []
    ];
    file_put_contents($file, json_encode($data));
    echo json_encode(['success' => true, 'id' => $id]);
}
elseif ($action === 'toggle_check') {
    $habitId = $_POST['habitId'];
    $date = $_POST['date']; // Formato YYYY-MM-DD
    
    $checks = $data[$user]['2026'][$habitId]['checks'];
    
    if (in_array($date, $checks)) {
        $data[$user]['2026'][$habitId]['checks'] = array_values(array_diff($checks, [$date])); // Quitar
        $status = false;
    } else {
        $data[$user]['2026'][$habitId]['checks'][] = $date; // Poner
        $status = true;
    }
    
    file_put_contents($file, json_encode($data));
    echo json_encode(['success' => true, 'status' => $status]);
}
?>
