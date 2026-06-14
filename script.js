// CONFIGURACIÓN: Reemplaza esto con tu usuario de GitHub
const GITHUB_USERNAME = "LuisAlbertoRT";

// Elemento donde se cargarán los proyectos
const projectsContainer = document.getElementById('github-projects');

// Función para obtener proyectos desde `repos.json` (local) o desde la API como fallback
async function fetchGitHubProjects() {
    try {
        // Intentamos cargar un listado estático local `repos.json` primero
        let repos;
        try {
            const localRes = await fetch('repos.json');
            if (localRes.ok) repos = await localRes.json();
        } catch (e) {
            repos = undefined;
        }

        // Si no hay archivo local, recurrimos a la API de GitHub (fallback)
        if (!repos) {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
            if (response.status === 403) {
                projectsContainer.innerHTML = '<p class="loading">Límite de la API de GitHub alcanzado. Usa `repos.json` o añade un token.</p>';
                return;
            }
            if (!response.ok) throw new Error('No se pudieron cargar los proyectos.');
            repos = await response.json();
        }

        // Limpiamos el mensaje de "Cargando"
        projectsContainer.innerHTML = '';

        if (!repos || repos.length === 0) {
            projectsContainer.innerHTML = '<p class="loading">No se encontraron repositorios públicos.</p>';
            return;
        }

        // Iteramos sobre cada repositorio y mostramos enlaces directos (sin previews)
        for (const repo of repos) {
            if (repo.name === `${GITHUB_USERNAME}.github.io`) continue;

            const description = repo.description ? repo.description : "Sin descripción disponible.";
            const updatedDate = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : '';

            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <div class="project-meta">
                    <span>${repo.language || 'N/A'}</span>
                    <span>🍴 ${repo.forks_count || 0}</span>
                    ${updatedDate ? `<span>Última actualización: ${updatedDate}</span>` : ''}
                </div>
                <p>${description}</p>
                <div class="project-actions">
                    <a href="${repo.html_url}" target="_blank" class="repo-link">Ver en GitHub →</a>
                    ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="repo-link secondary">Sitio Demo</a>` : ''}
                </div>
            `;

            projectsContainer.appendChild(card);
        }

    } catch (error) {
        console.error(error);
        projectsContainer.innerHTML = `<p class="loading">Error: ${error.message}. Verifica el usuario en script.js</p>`;
    }
}

// Ejecutamos la función al cargar la página
fetchGitHubProjects();

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) mainNav.classList.remove('open');
        });
    }
});