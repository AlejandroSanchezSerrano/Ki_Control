const year = 2026;
let currentMonth = 0; // Enero es 0
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    loadHabits();
});

function initMonthSelector() {
    const select = document.getElementById('monthSelect');
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = m + " " + year;
        select.appendChild(opt);
    });
    
    // Detectar mes actual si estamos en 2026, si no, Enero
    const now = new Date();
    if(now.getFullYear() === year) currentMonth = now.getMonth();
    select.value = currentMonth;
    
    select.addEventListener('change', (e) => {
        currentMonth = parseInt(e.target.value);
        renderCalendar();
    });
}

let habitsData = {};

async function loadHabits() {
    const formData = new FormData();
    formData.append('action', 'load');
    
    const res = await fetch('api.php', { method: 'POST', body: formData });
    habitsData = await res.json();
    renderCalendar();
    renderVisualProgress(); // Renderizar barras verticales
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function renderCalendar() {
    const headerRow = document.getElementById('tableHeader');
    const body = document.getElementById('tableBody');
    const daysInMonth = getDaysInMonth(currentMonth, year);
    
    // Limpiar tabla (manteniendo la primera columna de headers)
    headerRow.innerHTML = '<th style="width: 200px; text-align:left; background:#111;">HABITO</th>';
    body.innerHTML = '';

    // Generar cabeceras de días (1, 2, 3...)
    for(let d=1; d<=daysInMonth; d++) {
        const th = document.createElement('th');
        th.innerText = d;
        // Colorear fin de semana
        const date = new Date(year, currentMonth, d);
        if(date.getDay() === 0 || date.getDay() === 6) th.style.color = '#fbbf24';
        headerRow.appendChild(th);
    }

    // Generar filas por cada hábito
    Object.values(habitsData).forEach(habit => {
        const tr = document.createElement('tr');
        
        // Celda del nombre
        const tdName = document.createElement('td');
        tdName.innerHTML = `<span style="color:${habit.color}; font-weight:bold;">${habit.name}</span><br><span style="font-size:0.6rem; color:#666">${habit.category}</span>`;
        tdName.style.background = "#1a1a1a";
        tr.appendChild(tdName);

        // Celdas de checkboxes
        for(let d=1; d<=daysInMonth; d++) {
            const td = document.createElement('td');
            const dateStr = `${year}-${String(currentMonth+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'pixel-checkbox';
            checkbox.style.borderColor = habit.color; // Borde del color del hábito
            
            // Si el hábito tiene marcado ese color, usar su color de fondo
            if(habit.checks.includes(dateStr)) {
                checkbox.checked = true;
                checkbox.style.backgroundColor = habit.color;
            }

            checkbox.addEventListener('change', () => toggleCheck(habit.id, dateStr));
            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        body.appendChild(tr);
    });
}

function renderVisualProgress() {
    const container = document.getElementById('visualProgress');
    container.innerHTML = '';

    Object.values(habitsData).forEach(habit => {
        const totalChecks = habit.checks.length;
        // Altura máxima 200px para evitar overflow, escalamos dividiendo por 2 o usando % de un objetivo
        // Digamos que el "tope" visual son 100 días para llenar la barra al 100% de altura (o ajustable)
        const heightPx = Math.min(totalChecks * 2, 200); 

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        barContainer.innerHTML = `
            <div class="bar" style="height: ${heightPx}px; background-color: ${habit.color}; box-shadow: 0 0 10px ${habit.color}80;">
                <div class="bar-value" style="color:${habit.color}">${totalChecks}</div>
            </div>
            <div class="bar-label" style="color:${habit.color}">${habit.name.substring(0, 6)}..</div>
        `;
        container.appendChild(barContainer);
    });
}

async function toggleCheck(habitId, dateStr) {
    const formData = new FormData();
    formData.append('action', 'toggle_check');
    formData.append('habitId', habitId);
    formData.append('date', dateStr);

    await fetch('api.php', { method: 'POST', body: formData });
    
    // Actualizar localmente para no recargar todo
    const habit = habitsData[habitId];
    if(habit.checks.includes(dateStr)) {
        habit.checks = habit.checks.filter(d => d !== dateStr);
    } else {
        habit.checks.push(dateStr);
    }
    renderVisualProgress(); // Animación en tiempo real de la barra subiendo
}

async function addHabitPrompt() {
    const name = prompt("Nombre del hábito (Ej: Leer):");
    if(!name) return;
    const category = prompt("Categoría (Salud, Trabajo...):", "General");
    
    // Asignar color aleatorio o predefinido
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const formData = new FormData();
    formData.append('action', 'add_habit');
    formData.append('name', name);
    formData.append('category', category);
    formData.append('color', color);

    await fetch('api.php', { method: 'POST', body: formData });
    loadHabits(); // Recargar
}
