import { 
    showError, 
    showLoading, 
    hideError, 
    hideLoading, 
    searchInput, 
    resultsContainer, 
    paginationContainer, 
    displayResults, 
    displayGeneralResults, 
    itemsPerPage, 
    currentPage 
} from "./ui.js";

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const cache = new Map(); 
const CACHE_DURATION = 5 * 60 * 1000; 

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(url) {

    const cached = cache.get(url);

    if (cached) {      
        const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;  
            
        if (!isExpired) {           
            return cached.promise;     
        }
        
        cached.controller?.abort();
        
        cache.delete(url);   
    }

    const controller = new AbortController();

    const promise = fetch(url, { signal: controller.signal })
        .then(async response => {   

            if (!response.ok) {         
                throw new Error("HTTP error");       
            }
            
            const totalItemsHeader = response.headers.get('x-total-count');
            const totalItems = totalItemsHeader ? Number(totalItemsHeader) : null;
            const items = await response.json();

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
            return cached.promise;     
        }      

        cached.controller?.abort();
        
        cache.delete(url);   
    }

    const controller = new AbortController();

    const promise = axios.get(url, { signal: controller.signal })
        .then(async response => {   
            const totalItems = response.headers['x-total-count'] ? Number(response.headers['x-total-count']) : null;
            const items = response.data;

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


export async function fetchData() {

    const mode = document.querySelector('input[name="apiSelector"]:checked')?.value;
    const searchTerm = searchInput.value.trim();
    const url = API_URL + `?_page=${currentPage}&_limit=${itemsPerPage}&q=${searchTerm}`
    
    showLoading();
    hideError();
    resultsContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    try {

        if (mode === 'axios') {

            const response = await fetchDataWithAxios(url);
            if (!response.totalItems) throw new Error(fetcherrors('no_items'));
            displayResults(response.items, response.totalItems)

        } else if (mode === 'fetch') {

            const response = await fetchDataWithFetch(url);
            if (!response.totalItems) throw new Error(fetcherrors('no_items'));
            displayResults(response.items, response.totalItems)

        } else if (mode === 'custom') {

            if (!searchTerm) {
                throw new Error('Please enter a valid API URL')
                
            } else {
                const response = await fetchDataWithAxios(searchTerm);
                displayGeneralResults(response.items)
            }

        } else {
            throw new Error('Please select an API mode')
        }

    } catch (error) {
        showError(error.message)

    } finally {
        hideLoading();
    }
}