
// Grab the base url from .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * A generic helper function to handle fetch requests and catch errors.
 * Saves from writing the same try/catch blocks a hundred times.
 * * @param {string} endpoint - The API route (e.g., '/recipes')
 * @param {Object} options - Fetch options (method, headers, body)
 */

async function fetchWrapper(endpoint, options = {}) {
    // check if we are sending files
    const isFormData = options.body instanceof FormData;
    
    // Conditionally build our headers
    const headers = { ...options.headers };
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers,
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
},
// auth routes 
    login: (credentials) => {
        return fetchWrapper('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    // logout 
    logout: () => {
        return fetchWrapper('/logout', {
            method: 'POST',
        });
    },
    /**
     * Permanently delete a recipe
     *  @param {number} id 
     */
    deleteRecipe: (id) => {
       return fetchWrapper(`${API_BASE_URL}/recipes?id=${id}`, { method: 'DELETE' })
        // return fetchWrapper(`${API_BASE_URL}/recipes/${id}`, { method: 'DELETE' })
    },
    /**
     * Toggle a recipe's draft status
     * @param {number} id 
     * @param {boolean} isDraft - true hides it, false publishes it
     */
    toggleDraft: (id, isDraft) => {
        return fetchWrapper('/recipes/draft', {
            method: 'PUT',
            body: JSON.stringify({ id, is_draft: isDraft ? 1 : 0 }),
        });
    },

    // Image upload route
    uploadImages: (formData) => {
        return fetchWrapper('/upload', {
            method: 'POST',
            body: formData,
        });
    },
    /**
     * Update an existing recipe
     * @param {number} id - The ID of the recipe to update
     * @param {Object} recipeData - The updated recipe data
     */
    updateRecipe: (id, recipeData) => {
        return fetchWrapper(`/recipes?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(recipeData),
        });
    },
    /**
     * Allow Premium users to save a generated recipe from the Engine directly to the vault.
     * @param {Object} recipeData - The generated recipe object
     */
    saveGeneratedRecipe: (recipeData) => {
        return fetchWrapper('/recipes/save-generated', {
            method: 'POST',
            body: JSON.stringify(recipeData),
        });
    },
    // auth routes 
    login: (credentials) => {
        return fetchWrapper('/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    // --- THE TOKEN ROUTE ---
    deductToken: () => {
        return fetchWrapper('/users/deduct-token', {
            method: 'POST',
        });
    },
}