<?php
session_start();
if(isset($_SESSION['user'])) { header("Location: dashboard.php"); exit; }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ki Control - Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="login-container">
        <div class="retro-box">
            <h1 style="color: var(--accent-green); font-size: 1.5rem;">Ki Control</h1>
            <p class="pixel-font" style="font-size: 0.6rem; margin-bottom: 20px;">Press Start to Begin</p>
            
            <form id="authForm">
                <input type="text" name="username" class="retro-input" placeholder="Usuario" required>
                <input type="password" name="password" class="retro-input" placeholder="Contraseña" required>
                <input type="hidden" name="action" value="login" id="actionInput">
                
                <button type="submit" class="retro-btn">ENTRAR</button>
                <button type="button" class="retro-btn" onclick="toggleMode()" style="background:var(--accent-blue)">REGISTRARSE</button>
            </form>
            <p id="msg" style="margin-top:10px; color: red; font-size: 0.7rem;"></p>
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
                action.value = "login";
                toggleBtn.innerText = "REGISTRARSE";
            } else {
                btn.innerText = "CREAR CUENTA";
                action.value = "register";
                toggleBtn.innerText = "VOLVER";
            }
        }

        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const response = await fetch('auth.php', { method: 'POST', body: formData });
            const data = await response.json();
            
            if(data.success) {
                window.location.href = 'dashboard.php';
            } else {
                document.getElementById('msg').innerText = data.message;
            }
        });
    </script>
</body>
</html>
