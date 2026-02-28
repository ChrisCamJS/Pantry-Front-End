
// Grab the base url from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * A generic helper function to handle fetch requests and catch errors.
 * Saves from writing the same try/catch blocks a hundred times.
 * * @param {string} endpoint - The API route (e.g., '/recipes')
 * @param {Object} options - Fetch options (method, headers, body)
 */

async function fetchWrapper(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || 'Something went pear-shaped with the API!');
        }
        return data;
    }
    catch (error) {
        console.error(`API Error at ${endpoint}`, error);
        throw error;
    }
}

export const api = {
    /**
   * Fetch all recipes for the main grid.
   */
    getRecipes: () => {
        return fetchWrapper('/recipes', {method: 'GET'});
    },
    getRecipesById: (id) => {
        return fetchWrapper(`/recipes/single?id=${id}`, {method: 'GET'});
    },
/**
    * Securely add a new recipe to the database via the Admin Vault.
    * @param {Object} recipeData - The complete recipe object
*/

addRecipe: (recipeData) => {
    return fetchWrapper('/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData),
    });
}

}