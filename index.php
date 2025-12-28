<?php
session_start();
if(isset($_SESSION['user'])) { header("Location: dashboard.php"); exit; }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ki Control - Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="retro-box">
            <h1 style="color: #4ade80; font-size: 1.5rem; margin-bottom:5px;">KI CONTROL</h1>
            <p class="pixel-font" style="font-size: 0.6rem; margin-bottom: 25px; color:#888;">2026 HABIT TRACKER</p>
            
            <form id="authForm">
                <input type="text" name="username" class="retro-input" placeholder="USUARIO" required autocomplete="off">
                <input type="password" name="password" class="retro-input" placeholder="CONTRASEÑA" required>
                <input type="hidden" name="action" value="login" id="actionInput">
                
                <button type="submit" class="retro-btn" style="background:#4ade80; width:100%;">ENTRAR</button>
                <button type="button" class="retro-btn" onclick="toggleMode()" style="background:transparent; color:#fff; border-color:#fff; width:100%;">REGISTRARSE</button>
            </form>
            <p id="msg" style="margin-top:15px; color: #ff5555; font-size: 0.7rem; font-family:'Inter'"></p>
        </div>
    </div>

    <script>
        let isLogin = true;
        function toggleMode() {
            isLogin = !isLogin;
            const btn = document.querySelector('button[type="submit"]');
            const action = document.getElementById('actionInput');
            const toggleBtn = document.querySelector('button[type="button"]');
            
            if(isLogin) {
                btn.innerText = "ENTRAR";
                btn.style.background = "#4ade80";
                action.value = "login";
                toggleBtn.innerText = "REGISTRARSE";
            } else {
                btn.innerText = "CREAR CUENTA";
                btn.style.background = "#60a5fa";
                action.value = "register";
                toggleBtn.innerText = "VOLVER";
            }
        }

        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                const response = await fetch('auth.php', { method: 'POST', body: formData });
                const data = await response.json();
                if(data.success) {
                    window.location.href = 'dashboard.php';
                } else {
                    document.getElementById('msg').innerText = data.message;
                }
            } catch(e) { document.getElementById('msg').innerText = "Error de conexión"; }
        });
    </script>
</body>
</html>
