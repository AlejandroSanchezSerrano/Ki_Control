<?php
session_start();
if(!isset($_SESSION['user'])) { header("Location: index.php"); exit; }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ki Control - 2026 Tracker</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header -->
    <header class="dashboard-header">
        <div class="logo">
            <span class="pixel-font" style="color:var(--text-main); font-size:1.2rem;">KI CONTROL</span>
            <span style="font-size:0.7rem; color:#666;">// MASTER YOURSELF</span>
        </div>
        <div class="user-controls">
            <span class="pixel-font" style="margin-right:20px;">HOLA, <?php echo strtoupper($_SESSION['user']); ?></span>
            <a href="logout.php" class="retro-btn" style="background:#ff5555; text-decoration:none;">SALIR</a>
        </div>
    </header>

    <!-- Visual Progress (Barras) -->
    <div class="progress-section" id="visualProgress">
        <!-- JS genera las barras aquí -->
    </div>

    <!-- Controles -->
    <div style="padding: 20px; display:flex; gap:15px; align-items:center; background:#1f1f1f; border-bottom:1px solid #333;">
        <select id="monthSelect" class="retro-input" style="width:auto; cursor:pointer;">
            <!-- JS llena meses -->
        </select>
        <button id="btnNewHabit" class="retro-btn" style="background:#fbbf24">
            + NUEVO HABITO
        </button>
    </div>

    <!-- Tabla -->
    <div class="tracker-container">
        <table class="retro-table" id="habitTable">
            <thead>
                <tr id="tableHeader">
                    <!-- JS llena columnas -->
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- JS llena filas -->
            </tbody>
        </table>
    </div>

    <script src="script.js"></script>
</body>
</html>
