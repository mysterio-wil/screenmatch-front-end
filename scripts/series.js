import getDatos from "./getDatos.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescripcion = document.getElementById('ficha-descripcion');

// Funcion para cargar temporadas
function cargarTemporadas() {
    getDatos(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = ''; // Limpia las opciones existentes

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Seleccione la temporada';
            listaTemporadas.appendChild(optionDefault);

            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas las temporadas';
            listaTemporadas.appendChild(optionTodos);

            const optionTop = document.createElement('option');
            optionTop.value = 'top';
            optionTop.textContent = 'Top 5 episodios';
            listaTemporadas.appendChild(optionTop);
        })
        .catch(error => {
            console.error('Error al obtener temporadas:', error);
        });
}

// Funcion para cargar episodios de una temporada o el Top 5
function cargarEpisodios() {
    let url;
    if (listaTemporadas.value === 'top') {
        url = `/series/${serieId}/temporadas/top`;
    } else if (listaTemporadas.value === 'todas') {
        url = `/series/${serieId}/temporadas/todas`;
    } else {
        url = `/series/${serieId}/temporadas/${listaTemporadas.value}`;
    }

    getDatos(url)
        .then(data => {
            fichaSerie.innerHTML = ''; 

            if (listaTemporadas.value === 'top') {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const listaHTML = data.map(episodio => `
                    <li>
                        Temporada ${episodio.temporada} - Episodio ${episodio.numeroEpisodio}: ${episodio.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                fichaSerie.appendChild(ul);
            } else {
                const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
                temporadasUnicas.forEach(temporada => {
                    const ul = document.createElement('ul');
                    ul.className = 'episodios-lista';

                    const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                    const listaHTML = episodiosTemporadaAtual.map(serie => `
                        <li>
                            ${serie.numeroEpisodio} - ${serie.titulo}
                        </li>
                    `).join('');
                    ul.innerHTML = listaHTML;

                    const paragrafo = document.createElement('p');
                    const linha = document.createElement('br');
                    paragrafo.textContent = `Temporada ${temporada}`;
                    fichaSerie.appendChild(paragrafo);
                    fichaSerie.appendChild(linha);
                    fichaSerie.appendChild(ul);
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener episodios:', error);
        });
}

// Funcion para cargar informaciones de la serie
function cargarInfoSerie() {
    getDatos(`/series/${serieId}`)
        .then(data => {
            fichaDescripcion.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h2>${data.titulo}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de evaluaciones:</b> ${data.evaluacion}</p>
                        <p>${data.sinopsis}</p>
                        <p><b>Actores:</b> ${data.actores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al obtener informaciones de la serie:', error);
        });
}

// Adiciona escuchador de evento para el elemento select
listaTemporadas.addEventListener('change', cargarEpisodios);

// Carga las informaciones de la série y las temporadas cuando la página carga
cargarInfoSerie();
cargarTemporadas();
