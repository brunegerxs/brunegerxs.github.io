// CONFIGURACIÓN: Nombre de usuario de GitHub
const USERNAME = 'brunegerxs';

// DICCIONARIO DE DESCRIPCIONES PARA LA MUESTRA DE CIENCIAS
// Aquí agregas la descripción de cada proyecto. Escribe el nombre exacto del repositorio.
const descripcionesFeria = {
    "aixd": "Descripción para el proyecto aixd...",
    "esp32": "Proyecto utilizando el microcontrolador ESP32 para...",
    "huerta2": "Segunda versión del sistema de automatización para la huerta escolar...",
    "huerta": "Primer prototipo del sistema de riego para la huerta...",
    "brunegerxs.github.io": "Catálogo web dinámico para presentar mis proyectos de ciencias.",
    "brune": "Descripción para el repositorio brune...",
    "index.html": "Página principal de prueba...",
    "gantt_startup_software_gimnasios-2-.html-a-index.html": "Diagrama de Gantt para la organización del proyecto del gimnasio...",
    "mi-sitio-web": "Mi primer sitio web personal..."
};

// Elementos del DOM
const repoGrid = document.getElementById('repoGrid');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const repoCount = document.getElementById('repoCount');
const themeToggleBtn = document.getElementById('themeToggle');

let allRepos = [];

// 1. Obtener repositorios automáticamente usando la API de GitHub
async function fetchRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar los repositorios.');
        }

        allRepos = await response.json();
        loading.style.display = 'none';

        if (allRepos.length === 0) {
            repoGrid.innerHTML = '<p class="status-msg">No se encontraron repositorios públicos.</p>';
            repoCount.textContent = '0 Repositorios';
            return;
        }

        repoCount.textContent = `${allRepos.length} Repositorios`;
        renderRepos(allRepos);

    } catch (error) {
        loading.innerHTML = `<p style="color: #f85149;">❌ Error: ${error.message}</p>`;
    }
}

// 2. Renderizar tarjetas de repositorios en el HTML
function renderRepos(repos) {
    repoGrid.innerHTML = '';

    repos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';

        // LÓGICA DE DESCRIPCIÓN: Prioriza el diccionario, luego GitHub, luego texto por defecto
        let description = 'Sin descripción disponible para este repositorio.';
        if (descripcionesFeria[repo.name]) {
            description = descripcionesFeria[repo.name];
        } else if (repo.description) {
            description = repo.description;
        }

        const language = repo.language ? repo.language : 'Texto / Varios';

        // Link a la web (Demo) si existe GitHub Pages o Homepage
        const demoLink = repo.homepage 
            ? `<a href="${repo.homepage}" target="_blank" title="Ver Demo" class="repo-link-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` 
            : '';

        card.innerHTML = `
            <div>
                <a href="${repo.html_url}" target="_blank" class="repo-title">
                    <i class="fa-regular fa-folder"></i> ${repo.name}
                </a>
                <p class="repo-desc">${description}</p>
            </div>
            <div class="repo-footer">
                <div class="repo-info">
                    <span class="lang-badge">
                        <span class="lang-circle"></span> ${language}
                    </span>
                    <span class="stars-count">
                        <i class="fa-regular fa-star"></i> ${repo.stargazers_count}
                    </span>
                </div>
                <div class="repo-links">
                    ${demoLink}
                    <a href="${repo.html_url}" target="_blank" title="Ver Código en GitHub" class="repo-link-btn">
                        <i class="fa-brands fa-github"></i>
                    </a>
                </div>
            </div>
        `;

        repoGrid.appendChild(card);
    });
}

// 3. Filtrar repositorios con el buscador
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRepos = allRepos.filter(repo => {
        const nameMatch = repo.name.toLowerCase().includes(searchTerm);
        
        // Permite buscar también por tu descripción personalizada
        const customDesc = descripcionesFeria[repo.name] ? descripcionesFeria[repo.name].toLowerCase() : "";
        const githubDesc = repo.description ? repo.description.toLowerCase() : "";
        
        const descMatch = customDesc.includes(searchTerm) || githubDesc.includes(searchTerm);
        const langMatch = repo.language && repo.language.toLowerCase().includes(searchTerm);
        
        return nameMatch || descMatch || langMatch;
    });
    renderRepos(filteredRepos);
});

// 4. Cambiar entre Modo Oscuro / Modo Claro
let isDark = true;
themeToggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggleBtn.innerHTML = isDark 
        ? '<i class="fa-solid fa-moon"></i> <span>Modo Oscuro</span>' 
        : '<i class="fa-solid fa-sun"></i> <span>Modo Claro</span>';
});

// Inicializar
fetchRepos();
