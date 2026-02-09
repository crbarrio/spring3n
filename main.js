"use strict"

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

const searchInput = document.getElementById('searchInput')
const fetchButton = document.getElementById('fetchButton')
const loadingElement = document.getElementById('loadingElement')
const errorElement = document.getElementById('errorElement')
const resultsContainer = document.getElementById('resultsContainer')
const paginationContainer = document.getElementById('paginationContainer')


fetchButton.addEventListener('click', () => {
    fetchData()
})


// Funció per mostrar l'indicador de càrrega
function showLoading() {
    loadingElement.classList.remove('hidden')
}

// Funció per amagar l'indicador de càrrega
function hideLoading() {
    loadingElement.classList.add('hidden')
}

// Funció per mostrar missatges d'error
function showError(message) {
    errorElement.innerHTML = message
    errorElement.classList.remove('hidden')
}

// Funció per amagar missatges d'error
function hideError() {
    errorElement.classList.add('hidden')
}

// Funció principal per obtenir dades (a implementar)
async function fetchData() {
    const searchTerm = searchInput.value.trim();
    const useAxios = document.querySelector('input[name="apiSelector"]:checked')?.value === 'axios';
    
    showLoading();
    hideError();
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    try {
        let response

        if (useAxios) {
            // ... (Crida la funció per obtenir dades amb Axios)
        } else {
            response = await fetchDataWithFetch(searchTerm);
            
        }



    } catch (error) {
        console.log(error)
        // ... (Gestiona errors inesperats si s'escapen de les funcions específiques de Fetch/Axios)
        //  if (response.status === 404) throw new Error('404, Not found');
        //  if (response.status === 500) throw new Error('500, internal server error');
            

    } finally {
        hideLoading();
    }
}

// Funció per a la visualització dels resultats i la paginació (a implementar)
function displayResults(items, totalItems) {
    let output = ``;
    items.forEach(item => {
        output += `${item.title}<br>${item.body}<br><br><br>`
        
    });
    resultsContainer.innerHTML = output
}

function setupPagination(totalItems) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let output = ``;

    if (totalPages > 1) {

        for (let index = 1; index <= totalPages; index++) {

            const activeAttr = index === currentPage ? ' aria-current="page"' : '';
            output += `<button data-page="${index}" ${activeAttr}>${index}</button>`
            
        }

        paginationContainer.innerHTML = output
    }

}

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(searchTerm) {

    const url = API_URL + `?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`

    try {
        const response = await fetch(url);

        if (response.ok) {
            const totalItemsHeader = response.headers.get('x-total-count');
            const totalItems = totalItemsHeader ? Number(totalItemsHeader) : null;
            const items = await response.json();

            if (!totalItems) return {oK: 'false', error: 'No items'}

            displayResults(items, totalItems)
            setupPagination(totalItems)
            

        } else {
            
           
        }

        
        
    } catch (error) {
        console.error('Fetch', error);

    }


}

// Funció per obtenir dades amb Axios (a implementar)
                                                                                    
async function fetchDataWithAxios(searchTerm) {
    // ... (Implementa la petició amb Axios)
}