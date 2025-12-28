const year = 2026;
let currentMonth = 0; 
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
let habitsData = {};

document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    loadHabits();

    // Listener seguro para el botón
    const btnNew = document.getElementById('btnNewHabit');
    if(btnNew) {
        btnNew.addEventListener('click', addHabitPrompt);
    }
});

function initMonthSelector() {
    const select = document.getElementById('monthSelect');
    if(!select) return;
    
    select.innerHTML = '';
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = m + " " + year;
        select.appendChild(opt);
    });
    
    const now = new Date();
    if(now.getFullYear() === year) currentMonth = now.getMonth();
    select.value = currentMonth;
    
    select.addEventListener('change', (e) => {
        currentMonth = parseInt(e.target.value);
        renderCalendar();
    });
}

async function loadHabits() {
    try {
        const formData = new FormData();
        formData.append('action', 'load');
        const res = await fetch('api.php', { method: 'POST', body: formData });
        if(!res.ok) throw new Error("Error API");
        
        habitsData = await res.json();
        if(habitsData) {
            renderCalendar();
            renderVisualProgress();
        }
    } catch (e) {
        console.error("Error cargando:", e);
    }
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

function renderCalendar() {
    const headerRow = document.getElementById('tableHeader');
    const body = document.getElementById('tableBody');
    if(!headerRow || !body) return;

    const daysInMonth = getDaysInMonth(currentMonth, year);
    
    // Header
    headerRow.innerHTML = '<th style="width: 250px; text-align:left; background:#111; padding-left:15px;">MISIONES / HABITOS</th>';
    for(let d=1; d<=daysInMonth; d++) {
        const th = document.createElement('th');
        th.innerText = d;
        const date = new Date(year, currentMonth, d);
        if(date.getDay() === 0 || date.getDay() === 6) th.style.color = '#fbbf24';
        headerRow.appendChild(th);
    }

    body.innerHTML = '';

    if(Object.keys(habitsData).length === 0) {
        body.innerHTML = '<tr><td colspan="35" style="padding:40px;">No tienes hábitos. Pulsa el botón amarillo para empezar.</td></tr>';
        return;
    }

    Object.values(habitsData).forEach(habit => {
        const tr = document.createElement('tr');
        
        // Nombre lateral
        const tdName = document.createElement('td');
        tdName.innerHTML = `<span style="color:${habit.color}; font-size:0.8rem;">${habit.name}</span>`;
        tdName.style.textAlign = "left";
        tdName.style.background = "#181818";
        tdName.style.paddingLeft = "15px";
        tr.appendChild(tdName);

        // Checkboxes
        for(let d=1; d<=daysInMonth; d++) {
            const td = document.createElement('td');
            const dateStr = `${year}-${String(currentMonth+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'pixel-checkbox';
            checkbox.style.borderColor = habit.color; // Borde siempre del color
            
            // Estado inicial
            const isChecked = habit.checks && habit.checks.includes(dateStr);
            if(isChecked) {
                checkbox.checked = true;
                checkbox.style.backgroundColor = habit.color; // Relleno si está check
            } else {
                checkbox.style.backgroundColor = 'transparent';
            }

            // Evento Click (Cambio de color inmediato)
            checkbox.addEventListener('change', (e) => {
                if(e.target.checked) {
                    e.target.style.backgroundColor = habit.color;
                } else {
                    e.target.style.backgroundColor = 'transparent';
                }
                toggleCheck(habit.id, dateStr);
            });

            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        body.appendChild(tr);
    });
}

function renderVisualProgress() {
    const container = document.getElementById('visualProgress');
    if(!container) return;
    container.innerHTML = '';

    Object.values(habitsData).forEach(habit => {
        const totalChecks = habit.checks ? habit.checks.length : 0;
        
        // Cálculo Porcentaje (Año 2026 = 365 días)
        const percent = ((totalChecks / 365) * 100).toFixed(1);
        
        // Altura Visual: Hacemos que la barra se vea llena al 100% de altura solo si llegas a una meta realista visual
        // Pero el porcentaje escrito será el real anual.
        // Para que se vea "bonito", definimos un máximo de altura de píxeles (ej: 180px)
        // La barra crecerá linealmente hasta llenar esos 180px cuando llegues al 100% (365 días)
        const maxBarHeight = 160; 
        const currentHeight = (totalChecks / 365) * maxBarHeight;
        
        // Aseguramos que se vea al menos un poquito si tienes 1 día
        const finalHeight = totalChecks > 0 ? Math.max(currentHeight, 4) : 0; 

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        barContainer.innerHTML = `
            <div class="bar" style="height: ${finalHeight}px; background-color: ${habit.color}; box-shadow: 0 0 15px ${habit.color}50;">
                <div class="bar-stats">
                    <div class="percent-text">${percent}%</div>
                    <div class="days-text" style="border:1px solid ${habit.color}">${totalChecks} DIAS</div>
                </div>
            </div>
            <div class="bar-label" style="color:${habit.color}">${habit.name}</div>
        `;
        container.appendChild(barContainer);
    });
}

async function toggleCheck(habitId, dateStr) {
    const formData = new FormData();
    formData.append('action', 'toggle_check');
    formData.append('habitId', habitId);
    formData.append('date', dateStr);

    try {
        await fetch('api.php', { method: 'POST', body: formData });
        
        // Actualizar datos en memoria local para rapidez visual
        const habit = habitsData[habitId];
        if(!habit.checks) habit.checks = [];
        
        if(habit.checks.includes(dateStr)) {
            habit.checks = habit.checks.filter(d => d !== dateStr);
        } else {
            habit.checks.push(dateStr);
        }
        renderVisualProgress(); // Actualizar barras arriba al instante
    } catch(e) {
        console.error("Error guardando:", e);
    }
}

async function addHabitPrompt() {
    const name = prompt("¿Qué hábito quieres forjar?");
    if(!name) return;
    
    const category = prompt("Categoría (Salud, Dinero, Amor...):", "General");
    
    // Paleta de colores Neón
    const colors = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#f87171', '#2dd4bf'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const formData = new FormData();
    formData.append('action', 'add_habit');
    formData.append('name', name);
    formData.append('category', category);
    formData.append('color', color);

    try {
        const res = await fetch('api.php', { method: 'POST', body: formData });
        const data = await res.json();
        if(data.success) {
            loadHabits();
        }
    } catch(e) { console.error(e); }
}
