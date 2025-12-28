<?php
session_start();
if(!isset($_SESSION['user'])) { header("Location: index.php"); exit; }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ki Control - Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header -->
    <header class="dashboard-header">
        <div class="logo">
            <span class="pixel-font" style="color:var(--accent-green)">KI CONTROL</span>
            <span style="font-size:0.7rem; color:#888;">// 2026 TRACKER</span>
        </div>
        <div class="user-controls">
            <span class="pixel-font">Hola, <?php echo $_SESSION['user']; ?></span>
            <a href="logout.php" class="retro-btn" style="background:#ff5555; text-decoration:none;">SALIR</a>
        </div>
    </header>

    <!-- Sección de Barras Verticales -->
    <div class="progress-section" id="visualProgress">
        <!-- Las barras se generarán aquí con JS -->
    </div>

    <!-- Controles de Fecha y Gestión -->
    <div style="padding: 20px; display:flex; gap:10px; align-items:center; background:#222;">
        <select id="monthSelect" class="retro-input" style="width:auto;">
            <!-- JS llenará esto -->
        </select>
        <button onclick="addHabitPrompt()" class="retro-btn" style="background:var(--accent-gold)">+ NUEVO HABITO</button>
    </div>

    <!-- Tabla de Hábitos -->
    <div class="tracker-container">
        <table class="retro-table" id="habitTable">
            <thead>
                <tr id="tableHeader">
                    <th style="width: 200px; text-align:left;">HABITO</th>
                    <!-- Los días se generan con JS -->
                </tr>
            </thead>
            <tbody id="tableBody">
                <!-- Las filas se generan con JS -->
            </tbody>
        </table>
    </div>

    <script src="script.js"></script>
</body>
</html>
