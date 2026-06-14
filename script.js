// CONFIGURACIÓN: Reemplaza esto con tu usuario de GitHub
const GITHUB_USERNAME = "LuisAlbertoRT ";

// Elemento donde se cargarán los proyectos
const projectsContainer = document.getElementById('github-projects');

// Función para obtener proyectos desde la API de GitHub
async function fetchGitHubProjects() {
    try {
        // Obtenemos los repositorios públicos del usuario, ordenados por los más recientes
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('No se pudieron cargar los proyectos.');
        }

        const repos = await response.json();
        
        // Limpiamos el mensaje de "Cargando"
        projectsContainer.innerHTML = '';

        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p class="loading">No se encontraron repositorios públicos.</p>';
            return;
        }

        // Iteramos sobre cada repositorio y creamos su tarjeta
        repos.forEach(repo => {
            // Ignoramos el repositorio de la propia página web si quieres
            if (repo.name === `${GITHUB_USERNAME}.github.io`) return;

            // Creamos la estructura HTML de la tarjeta
            const card = document.createElement('div');
            card.className = 'project-card';

            // Tratamos la descripción si es nula
            const description = repo.description ? repo.description : "Sin descripción disponible.";

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${description}</p>
                <div class="project-stats">
                    <span>${repo.language || 'N/A'}</span>
                    <span>⭐ ${repo.stargazers_count}</span>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">Ver en GitHub →</a>
                </div>
            `;

            projectsContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        projectsContainer.innerHTML = `<p class="loading">Error: ${error.message}. Verifica el usuario en script.js</p>`;
    }
}

// Ejecutamos la función al cargar la página
fetchGitHubProjects();