const year = 2026;
let currentMonth = 0; 
const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
let habitsData = {};

document.addEventListener('DOMContentLoaded', () => {
    initAutoDate();
    loadHabits();

    const btnNew = document.getElementById('btnNewHabit');
    if(btnNew) {
        btnNew.addEventListener('click', addHabitPrompt);
    }
});

function initAutoDate() {
    const title = document.getElementById('monthTitle');
    const now = new Date();
    const currentYear = now.getFullYear();
    const realMonth = now.getMonth(); 
    
    // Lógica 2025/2026
    if (currentYear < 2026) {
        currentMonth = 0; // Pre-lanzamiento (Enero)
    } else if (currentYear === 2026) {
        currentMonth = realMonth;
    } else {
        currentMonth = 11;
    }

    if(title) {
        title.innerText = `${months[currentMonth]} ${year}`;
    }
}

async function loadHabits() {
    try {
        const formData = new FormData();
        formData.append('action', 'load');
        const res = await fetch('api.php', { method: 'POST', body: formData });
        if(!res.ok) throw new Error("Error API");
        
        habitsData = await res.json();
        if(habitsData) {
            renderCalendar();      // Desktop
            renderVisualProgress(); // Híbrido
            renderDailyView();      // Móvil
        }
    } catch (e) { console.error("Error cargando:", e); }
}

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}

// Renderizado Tabla Desktop
function renderCalendar() {
    const headerRow = document.getElementById('tableHeader');
    const body = document.getElementById('tableBody');
    if(!headerRow || !body) return;

    const daysInMonth = getDaysInMonth(currentMonth, year);
    
    headerRow.innerHTML = '<th style="width: 250px; text-align:left; background:#111; padding-left:15px;">MISIONES</th>';
    for(let d=1; d<=daysInMonth; d++) {
        const th = document.createElement('th');
        th.innerText = d;
        const date = new Date(year, currentMonth, d);
        if(date.getDay() === 0 || date.getDay() === 6) th.style.color = '#fbbf24';
        headerRow.appendChild(th);
    }

    body.innerHTML = '';
    if(Object.keys(habitsData).length === 0) return;

    Object.values(habitsData).forEach(habit => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        tdName.innerHTML = `<span style="color:${habit.color}; font-size:0.8rem;">${habit.name}</span>`;
        tdName.style.textAlign = "left";
        tdName.style.background = "#181818";
        tdName.style.paddingLeft = "15px";
        tr.appendChild(tdName);

        for(let d=1; d<=daysInMonth; d++) {
            const td = document.createElement('td');
            const dateStr = `${year}-${String(currentMonth+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'pixel-checkbox';
            checkbox.style.borderColor = habit.color; 
            
            if(habit.checks && habit.checks.includes(dateStr)) {
                checkbox.checked = true;
                checkbox.style.backgroundColor = habit.color;
            } else {
                checkbox.style.backgroundColor = 'transparent';
            }

            checkbox.addEventListener('change', (e) => {
                if(e.target.checked) e.target.style.backgroundColor = habit.color;
                else e.target.style.backgroundColor = 'transparent';
                toggleCheck(habit.id, dateStr);
            });

            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        body.appendChild(tr);
    });
}

// Renderizado Barras Híbrido (Desktop/Móvil LISTA VERTICAL)
function renderVisualProgress() {
    const container = document.getElementById('visualProgress');
    if(!container) return;
    container.innerHTML = '';
    
    const isMobile = window.innerWidth <= 768;

    Object.values(habitsData).forEach(habit => {
        const totalChecks = habit.checks ? habit.checks.length : 0;
        const percent = ((totalChecks / 365) * 100).toFixed(1);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        if(isMobile) {
            // MÓVIL: Estructura Vertical de Lista
            // Nombre y Porcentaje arriba
            const labelDiv = document.createElement('div');
            labelDiv.className = 'bar-label';
            labelDiv.innerHTML = `<span style="color:${habit.color}">${habit.name}</span> <span>${percent}%</span>`;
            
            // Barra debajo (ancho porcentual real)
            const wrapperDiv = document.createElement('div');
            wrapperDiv.className = 'bar-wrapper';
            
            // Lógica visual móvil: % real del año (sin multiplicar x4, para ver progreso real o x2 para que se vea más)
            const widthPercent = Math.min((totalChecks / 365) * 100 * 2, 100); 

            const barDiv = document.createElement('div');
            barDiv.className = 'bar';
            barDiv.style.width = `${widthPercent}%`;
            barDiv.style.backgroundColor = habit.color;
            
            wrapperDiv.appendChild(barDiv);
            barContainer.appendChild(labelDiv);
            barContainer.appendChild(wrapperDiv);

        } else {
            // DESKTOP: Estructura Vertical de Barras (Original)
            const maxBarHeight = 180; 
            const currentHeight = (totalChecks / 365) * maxBarHeight;
            const finalHeight = totalChecks > 0 ? Math.max(currentHeight, 4) : 0;
            
            barContainer.innerHTML = `
                <div class="bar-wrapper">
                    <div class="bar" style="height: ${finalHeight}px; width: 50px; background-color: ${habit.color}; box-shadow: 0 0 10px ${habit.color}50;">
                        <div class="bar-stats">
                            <div class="percent-text">${percent}%</div>
                            <div class="days-text" style="border:1px solid ${habit.color}">${totalChecks}</div>
                        </div>
                    </div>
                </div>
                <div class="bar-label" style="color:${habit.color}">${habit.name}</div>
            `;
        }
        
        container.appendChild(barContainer);
    });
}

// Renderizado Móvil (Solo Hoy - FILA HORIZONTAL)
function renderDailyView() {
    const container = document.getElementById('dailyCheckView');
    if(!container) return;
    container.innerHTML = '';

    const now = new Date();
    let checkYear = 2026;
    let checkMonth = 0; 
    let checkDay = 1;

    if(now.getFullYear() === 2026) {
        checkMonth = now.getMonth();
        checkDay = now.getDate();
    }
    
    const dateStr = `${checkYear}-${String(checkMonth+1).padStart(2, '0')}-${String(checkDay).padStart(2, '0')}`;
    
    const dayTitle = document.createElement('h3');
    dayTitle.className = 'pixel-font';
    dayTitle.style.textAlign = 'center';
    dayTitle.style.marginBottom = '20px';
    dayTitle.style.color = '#fff';
    dayTitle.innerText = `MISIONES DE HOY (${checkDay})`;
    container.appendChild(dayTitle);

    Object.values(habitsData).forEach(habit => {
        const row = document.createElement('div');
        // Usamos la clase CSS .daily-row para asegurar el layout horizontal
        row.className = 'daily-row'; 

        const name = document.createElement('span');
        name.innerText = habit.name;
        name.className = 'pixel-font';
        name.style.fontSize = '0.8rem'; // Letra legible
        name.style.color = habit.color;
        name.style.textAlign = 'left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'pixel-checkbox';
        // Tamaño fijo y controlado
        checkbox.style.width = '24px';
        checkbox.style.height = '24px';
        checkbox.style.borderColor = habit.color;
        checkbox.style.flexShrink = '0'; // Evita que se aplaste

        if(habit.checks && habit.checks.includes(dateStr)) {
            checkbox.checked = true;
            checkbox.style.backgroundColor = habit.color;
        }

        checkbox.addEventListener('change', (e) => {
            if(e.target.checked) e.target.style.backgroundColor = habit.color;
            else e.target.style.backgroundColor = 'transparent';
            toggleCheck(habit.id, dateStr);
        });

        row.appendChild(name);
        row.appendChild(checkbox);
        container.appendChild(row);
    });
}

async function toggleCheck(habitId, dateStr) {
    const formData = new FormData();
    formData.append('action', 'toggle_check');
    formData.append('habitId', habitId);
    formData.append('date', dateStr);

    try {
        await fetch('api.php', { method: 'POST', body: formData });
        
        const habit = habitsData[habitId];
        if(!habit.checks) habit.checks = [];
        
        if(habit.checks.includes(dateStr)) {
            habit.checks = habit.checks.filter(d => d !== dateStr);
        } else {
            habit.checks.push(dateStr);
        }
        
        // Renderizar todo de nuevo para que la barra de progreso suba al instante
        renderVisualProgress(); 
        if(window.innerWidth > 768) renderCalendar();
    } catch(e) { console.error("Error guardando:", e); }
}

async function addHabitPrompt() {
    const name = prompt("¿Qué hábito quieres forjar?");
    if(!name) return;
    const category = prompt("Categoría:", "General");
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
        if(data.success) loadHabits();
    } catch(e) { console.error(e); }
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}
