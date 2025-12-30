<?php
// Configuración estricta de CORS y Sesiones para Cross-Domain
header('Access-Control-Allow-Origin: https://tu-usuario.github.io'); // CAMBIA ESTO POR TU URL DE GITHUB PAGES EXACTA (sin slash al final)
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejo de Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuración de Cookie segura para Chrome/Brave/Edge
// Esto permite que la cookie de sesión viaje entre dominios distintos
$cookieParams = session_get_cookie_params();
session_set_cookie_params([
    'lifetime' => $cookieParams['lifetime'],
    'path' => '/',
    'domain' => '', // Dejar vacío para el dominio actual
    'secure' => true, // OBLIGATORIO: El hosting debe tener HTTPS
    'httponly' => true,
    'samesite' => 'None' // OBLIGATORIO para Cross-Site
]);

session_start();
?>
