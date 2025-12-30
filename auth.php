<?php
require 'cors.php'; // Cargamos cabeceras primero
require 'db.php';

$action = $_POST['action'] ?? '';
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Nueva acción para verificar sesión desde el JS al cargar la página
if ($action === 'check_session') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode(['logged_in' => true, 'user' => $_SESSION['user']]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'register') {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Usuario ocupado']);
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        if ($stmt->execute([$username, $hash])) {
            $_SESSION['user'] = $username;
            $_SESSION['user_id'] = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'user' => $username]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar']);
        }
    }
} elseif ($action === 'login') {
    $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user'] = $user['username'];
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['success' => true, 'user' => $user['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
    }
}
?>
