"use strict"
import { searchInput, apiSelector, setPage } from "./ui.js";
import { fetchData } from "./api.js";



// Listeners
fetchButton.addEventListener('click', () => {
    setPage(1);
    fetchData()
})

apiSelector.forEach( selector => {
    selector.addEventListener('change', e => {
        searchInput.value = ''
        if (e.currentTarget.value === 'custom') {
            searchInput.placeholder = 'API URL'
        } else {
            searchInput.placeholder = 'Search element'
        }
    })
})
