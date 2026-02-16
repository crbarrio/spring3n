import { 
    showError, 
    showLoading, 
    hideError, 
    hideLoading, 
    searchInput, 
    resultsContainer, 
    paginationContainer, 
    displayResults,
    itemsPerPage, 
    currentPage 
} from "./ui.js";

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const cache = new Map(); 
const CACHE_DURATION = 5 * 60 * 1000;

async function cached(url, doRequest) {
    const cachedEntry = cache.get(url);

    if (cachedEntry) {
        const expired = Date.now() - cachedEntry.timestamp > CACHE_DURATION;
        if (!expired) return cachedEntry.promise;

        cachedEntry.controller?.abort();
        cache.delete(url);
    }

    const controller = new AbortController();
    const promise = doRequest(controller.signal);

    cache.set(url, { promise, controller, timestamp: Date.now() });

    try {
        return await promise;
    } catch (error) {
        if (!isCanceled(error)) cache.delete(url);
        throw error;
    }
}

// Funció per obtenir dades amb Fetch (a implementar)
async function fetchDataWithFetch(url) {
    return cached(url, async (signal) => {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error("HTTP error");

        const totalItemsHeader = response.headers.get("x-total-count");
        const totalItems = totalItemsHeader ? Number(totalItemsHeader) : null;
        const items = await response.json();

        return { items, totalItems };
    });
}

// Funció per obtenir dades amb Axios (a implementar)
                                                                                    
async function fetchDataWithAxios(url) {
    return cached(url, async (signal) => {
        const response = await axios.get(url, { signal });
        const totalItems = response.headers?.["x-total-count"]
            ? Number(response.headers["x-total-count"])
            : null;

        return { items: response.data, totalItems };
    });
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
        let requestFn;
        let requestUrl = url;

        switch (mode) {
            case 'axios':
                requestFn = fetchDataWithAxios;
                break;

            case 'fetch':
                requestFn = fetchDataWithFetch;
                break;

            case 'custom':
                if (!searchTerm) throw new Error('Please enter a valid API URL');
                requestFn = fetchDataWithAxios;
                requestUrl = searchTerm;
                break;

            default:
                throw new Error('Please select an API mode');
        }

        const response = await requestFn(requestUrl);

        const items = response?.items ?? [];
        const totalItems = Number.isFinite(response?.totalItems)
            ? response.totalItems
            : items.length;

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error(fetcherrors('no_items'));
        }

        displayResults(items, totalItems, mode);

    } catch (error) {
        showError(error.message)

    } finally {
        hideLoading();
    }
}