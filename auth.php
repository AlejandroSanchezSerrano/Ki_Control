<?php
session_start();
header('Content-Type: application/json');

$file = 'data/users.json';
if (!file_exists('data')) { mkdir('data', 0777, true); }
if (!file_exists($file)) { file_put_contents($file, json_encode([])); }

$users = json_decode(file_get_contents($file), true) ?? [];
$action = $_POST['action'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if ($action === 'register') {
    if (isset($users[$username])) {
        echo json_encode(['success' => false, 'message' => 'Usuario ocupado']);
    } else {
        $users[$username] = ['password' => password_hash($password, PASSWORD_DEFAULT)];
        file_put_contents($file, json_encode($users));
        $_SESSION['user'] = $username;
        echo json_encode(['success' => true]);
    }
} elseif ($action === 'login') {
    if (isset($users[$username]) && password_verify($password, $users[$username]['password'])) {
        $_SESSION['user'] = $username;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }
}
?>
