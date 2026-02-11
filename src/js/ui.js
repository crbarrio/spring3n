import { formatAny, escapeHtml } from "./helpers.js";
import { fetchData } from "./api.js";

export const resultsContainer = document.getElementById('resultsContainer')
export const paginationContainer = document.getElementById('paginationContainer')
export const searchInput = document.getElementById('searchInput')
export const fetchButton = document.getElementById('fetchButton')
export const apiSelector = document.querySelectorAll('input[name=apiSelector]')
export const itemsPerPage = 10;

const loadingElement = document.getElementById('loadingElement')
const errorElement = document.getElementById('errorElement')

export let currentPage = 1;

export function setPage(page) {
    currentPage = page;
}

// Funció per mostrar l'indicador de càrrega
export function showLoading() {
    loadingElement.classList.remove('hidden')
}

// Funció per amagar l'indicador de càrrega
export function hideLoading() {
    loadingElement.classList.add('hidden')
}

// Funció per mostrar missatges d'error
export function showError(message) {
    errorElement.textContent = message
    errorElement.classList.remove('hidden')
}

// Funció per amagar missatges d'error
export function hideError() {
    errorElement.textContent = ''
    errorElement.classList.add('hidden')
}

export function displayGeneralResults(items) {
    if (items === undefined || items === null) {
        resultsContainer.innerHTML = `
            <div class="text-start border rounded-sm p-2 shadow-sm bg-white">
                <pre class="whitespace-pre-wrap text-xs">No data</pre>
            </div>`;
        return;
    }

    const list = Array.isArray(items) ? items : [items];
    let output = '';

    list.forEach(item => {
        output += `
            <div class="text-start border rounded-sm p-2 shadow-sm bg-white">
                <pre class="whitespace-pre-wrap text-xs">${escapeHtml(formatAny(item))}</pre>
            </div>`;
    });

    resultsContainer.innerHTML = output;
}




// Funció per a la visualització dels resultats i la paginació (a implementar)
export function displayResults(items, totalItems) {
    let output = ``;
    items.forEach(item => {
        output += `<div class="text-start border rounded-sm p-2 shadow-sm">
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
                setPage(Number(e.currentTarget.dataset.page))
                fetchData()
            })
        )
    }

}