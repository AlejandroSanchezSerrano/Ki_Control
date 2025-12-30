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
            <!-- <span style="font-size:0.7rem; color:#666;">// MASTER YOURSELF</span> -->
        </div>
        
        <!-- Menú Desktop -->
        <div class="user-controls desktop-only">
            <span class="pixel-font">HOLA, <?php echo strtoupper($_SESSION['user']); ?></span>
            <a href="logout.php" class="retro-btn" style="background:#ff5555; text-decoration:none;">SALIR</a>
        </div>

        <!-- Botón Menú Móvil -->
        <button class="mobile-menu-btn mobile-only" onclick="toggleMenu()">☰</button>
    </header>

    <!-- Menú Desplegable Móvil (Oculto por defecto) -->
    <div id="mobileMenu" class="mobile-menu">
        <span class="pixel-font" style="display:block; margin-bottom:20px; color:#fff;">HOLA, <?php echo strtoupper($_SESSION['user']); ?></span>
        <a href="logout.php" class="retro-btn" style="background:#ff5555; text-decoration:none; display:block; width:100%;">SALIR</a>
    </div>

    <!-- Visual Progress (Se adapta por CSS y JS) -->
    <div class="progress-section" id="visualProgress">
        <!-- Barras aquí -->
    </div>

    <!-- Controles -->
    <div class="controls-container">
        <h2 id="monthTitle" class="pixel-font" style="margin:0; color: #fff; font-size: 1.0rem; text-shadow: 2px 2px 0 #000;">
            CARGANDO...
        </h2>
        <button id="btnNewHabit" class="retro-btn" style="background:#fbbf24">
            + NUEVO
        </button>
    </div>

    <!-- VISTA MÓVIL: CHECKER DIARIO (Nuevo) -->
    <div id="dailyCheckView" class="mobile-only" style="padding:20px;">
        <!-- JS llenará esto con la lista simple del día -->
    </div>

    <!-- VISTA DESKTOP: TABLA MENSUAL (Se oculta en móvil) -->
    <div class="tracker-container desktop-only">
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
