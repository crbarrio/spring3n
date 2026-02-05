"use strict"

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;

const apiSelector = document.getElementsByName('apiSelector')
const searchInput = document.getElementById('searchInput')
const fetchButton = document.getElementById('fetchButton')
const loadingElement = document.getElementById('loadingElement')
const errorElement = document.getElementById('errorElement')
const resultsContainer = document.getElementById('resultsContainer')
const paginationContainer = document.getElementById('paginationContainer')


fetchButton.addEventListener('click', () => {
    // fetchData()
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
    const searchTerm = trim(searchInput.value);
    const useAxios = apiSelector.value === 'axios';
    
    showLoading();
    hideError();
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    try {
        if (useAxios) {
            // ... (Crida la funció per obtenir dades amb Axios)
        } else {
            const result = fetch(API_URL,)
        }
    } catch (error) {
        // ... (Gestiona errors inesperats si s'escapen de les funcions específiques de Fetch/Axios)
    } finally {
        hideLoading();
    }
}

// Funció per a la visualització dels resultats i la paginació (a implementar)
function displayResults(items, totalItems) {
    // ... (Implementa la lògica per mostrar cada "ítem" com una targeta i per cridar setupPagination)
}

function setupPagination(totalItems) {
    // ... (Implementa la lògica per crear els botons de paginació)
}

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(searchTerm) {
    // ... (Implementa la petició amb Fetch API)
}

// Funció per obtenir dades amb Axios (a implementar)
                                                                                    
async function fetchDataWithAxios(searchTerm) {
    // ... (Implementa la petició amb Axios)
}