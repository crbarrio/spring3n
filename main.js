"use strict"

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
let currentPage = 1;
const itemsPerPage = 10;
const cache = new Map(); 
const CACHE_DURATION = 5 * 60 * 1000; 

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

    const useAxios = document.querySelector('input[name="apiSelector"]:checked')?.value === 'axios';
    const searchTerm = searchInput.value.trim();
    const url = API_URL + `?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`
    
    showLoading();
    hideError();
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    try {

        if (useAxios) {
            const response = await fetchDataWithAxios(url);
            displayResults(response.items, response.totalItems)
        } else {
            const response = await fetchDataWithFetch(url);
            displayResults(response.items, response.totalItems)
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
async function fetchDataWithFetch(url) {

    const cached = cache.get(url);

    if (cached) {      
        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;  
            
        if (!isExpired) {       
            console.log("Reutilizando cache/promise");       
            return cached.promise;     
        }
        
        cached.controller?.abort();
        
        cache.delete(url);   
    }

    console.log("Nuevo fetch");

    const controller = new AbortController();

    const promise = fetch(url, { signal: controller.signal })
        .then(async response => {   

            if (!response.ok) {         
                throw new Error("HTTP error");       
            }
            
            const totalItemsHeader = response.headers.get('x-total-count');
            const totalItems = totalItemsHeader ? Number(totalItemsHeader) : null;
            const items = await response.json();

            if (!totalItems) {
                throw new Error(fetcherrors('no_items'));
            }

            return { items, totalItems };    
        }
    ); 

    cache.set(url, {     
        promise,
        controller,
        timestamp: Date.now()   
    });

    try {
        return await promise;

    } catch (error) {

        if (error.name !== "AbortError") {
            cache.delete(url);
        }

        throw error;
    }

}

// Funció per obtenir dades amb Axios (a implementar)
                                                                                    
async function fetchDataWithAxios(url) {

    const cached = cache.get(url);

    if (cached) {      
        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;  
            
        if (!isExpired) {       
            console.log("Reutilizando cache/promise");       
            return cached.promise;     
        }      

        cached.controller?.abort();
        
        cache.delete(url);   
    }

    console.log("Nuevo fetch");
    const controller = new AbortController();

    const promise = axios.get(url, { signal: controller.signal })
        .then(async response => {   

            const totalItems = response.headers['x-total-count'] ? Number(response.headers['x-total-count']) : null;
            const items = response.data;

            if (!totalItems) throw new Error(fetcherrors('no_items'));
            return {items, totalItems}
            
        }
    ); 

    cache.set(url, {     
        promise,
        controller,
        timestamp: Date.now()   
    });

    try {
        return await promise;

    } catch (error) {

        if (!axios.isCancel?.(error)) {
            cache.delete(url);
        }
        
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