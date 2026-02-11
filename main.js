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
    currentPage = 1;
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
    errorElement.textContent = message
    errorElement.classList.remove('hidden')
}

// Funció per amagar missatges d'error
function hideError() {
    errorElement.textContent = ''
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

        if (useAxios) {
            await fetchDataWithAxios(searchTerm)
        } else {
            await fetchDataWithFetch(searchTerm);
        }

    } catch (error) {
        showError(error.message)

    } finally {
        hideLoading();
    }
}

// Funció per a la visualització dels resultats i la paginació (a implementar)
function displayResults(items, totalItems) {
    let output = ``;
    items.forEach(item => {
        output += `<div class="text-start border rounded-sm p-2">
                <div class="">
                    <h4 class="font-semibold mb-1">${item.id}. ${item.title}</h4>
                    <hr class="mb-2">
                    <p class="card-text">${item.body}</p>
                </div>
            </div>`
        
    });
    resultsContainer.innerHTML = output

    setupPagination(totalItems)
}

function setupPagination(totalItems) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let output = ``;

    if (totalPages > 1) {

        for (let index = 1; index <= totalPages; index++) {

            let activeAttr = '';
            let buttonClass = 'pageButton font-medium leading-5 text-sm px-3 py-2';

            if (index === currentPage) {
                buttonClass += ' bg-gray-300';
                activeAttr = ' aria-current="page" disabled';
            } else {
                buttonClass += ' hover:bg-gray-200 focus:ring-1 focus:ring-gray-300';
            }

            output += `<button data-page="${index}" class="${buttonClass}"${activeAttr}>${index}</button>`
            
        }

        paginationContainer.innerHTML = output

        const pageButtons = document.querySelectorAll('.pageButton')
        pageButtons.forEach(btn =>
            btn.addEventListener('click', (e) => {
                currentPage = Number(e.currentTarget.dataset.page)
                fetchData()
            })
        )
    }

}

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(searchTerm) {

    const url = API_URL + `?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(fetcherrors(response.status));
        }

        if (response.ok && response.status === 200) {
            const totalItemsHeader = response.headers.get('x-total-count');
            const totalItems = totalItemsHeader ? Number(totalItemsHeader) : null;
            const items = await response.json();

            if (!totalItems) throw new Error(fetcherrors('no_items'));

            displayResults(items, totalItems)
        } 

    } catch (error) {
        throw error;
    }

}

// Funció per obtenir dades amb Axios (a implementar)
                                                                                    
async function fetchDataWithAxios(searchTerm) {
    try {
        const response = await axios.get(API_URL,{
            params: {
                _page: currentPage,
                _limit: itemsPerPage,
                q: searchTerm
            }
        });

        if (response.status === 200) {
            const totalItems = response.headers['x-total-count'] ? Number(response.headers['x-total-count']) : null;
            const items = response.data;

            if (!totalItems) throw new Error(fetcherrors('no_items'));

            displayResults(items, totalItems)
        }

    } catch (error) {
        throw error;
    }
}

function fetcherrors(errorCode) {
    switch (errorCode) {
        case 404:
            return 'Not found'
        case 500:
            return 'Internal Server Error'
        case 'response_ko':
            return 'There was no response from the server'
        case 'no_items':
            return 'We could not find any items'
        default:
            return 'There was an error'
    }
}