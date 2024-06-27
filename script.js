document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        fetchGitHubRepos();
        fetchCarouselData();
        fetchColegasData(); // Chamada da função para buscar dados dos colegas
    } else if (window.location.pathname.endsWith('repo.html')) {
        loadRepoDetails();
    }
});

function fetchGitHubRepos() {
    const username = 'sojota'; // Nome de usuário do GitHub
    const reposContainer = document.getElementById('repos');

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            repos.forEach(repo => {
                const repoCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${repo.name}</h5>
                                <p class="card-text">${repo.description || 'Sem descrição'}</p>
                                <a href="${repo.html_url}" class="btn btn-primary" target="_blank">Ver Repositório</a>
                            </div>
                        </div>
                    </div>
                `;
                reposContainer.innerHTML += repoCard;
            });
        })
        .catch(error => console.error('Erro ao buscar repositórios:', error));
}

function fetchColegasData() {
    fetch('db.json') // Caminho para o seu arquivo JSON com os dados dos colegas
        .then(response => response.json())
        .then(data => {
            const colegasContainer = document.querySelector('.colegas-container');
            colegasContainer.innerHTML = ''; // Limpa o conteúdo antes de adicionar os novos cards

            data.colegas.forEach(colega => {
                const cardHTML = `
                    <div class="card">
                        <img src="${colega.foto}" class="card-img-top" alt="${colega.alt}">
                        <div class="card-body">
                            <h5 class="card-title">${colega.nome}</h5>
                            <a href="${colega.github}" class="btn btn-secondary" target="_blank">Ver GitHub</a>
                        </div>
                    </div>
                `;
                colegasContainer.innerHTML += cardHTML;
            });
        })
        .catch(error => console.error('Erro ao buscar dados dos colegas:', error));
}

function fetchCarouselData() {
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const carouselIndicators = document.getElementById('carousel-indicators');
            const carouselInner = document.getElementById('carousel-inner');

            data.carousel.forEach((item, index) => {
                const indicator = `
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" ${index === 0 ? 'class="active"' : ''} aria-label="Slide ${index + 1}"></button>
                `;
                const carouselItem = `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${item.image}" class="d-block w-100" alt="${item.alt}">
                    </div>
                `;
                carouselIndicators.innerHTML += indicator;
                carouselInner.innerHTML += carouselItem;
            });
        })
        .catch(error => console.error('Erro ao buscar dados do carrossel:', error));
}

function loadRepoDetails() {
    const repoId = localStorage.getItem('selectedRepo');
    const repo = JSON.parse(sessionStorage.getItem(repoId));
    if (repo) {
        const repoDetailsContainer = document.getElementById('repo-details');
        const repoDetails = `
            <h2>${repo.name}</h2>
            <p>${repo.description || 'Sem descrição'}</p>
            <p><strong>Última atualização:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
            <p><a href="${repo.html_url}" class="btn btn-secondary" target="_blank">Ver no GitHub</a></p>
        `;
        repoDetailsContainer.innerHTML = repoDetails;
    } else {
        document.getElementById('repo-details').innerHTML = '<p>Repositório não encontrado.</p>';
    }
}
