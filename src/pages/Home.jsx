import React, {useState, useEffect} from 'react';
import RecipeCard from '../components/RecipeCard';
import {api} from  '../services/api';
import styles from './Home.module.css';
/**
 * Home Component
 * Fetches and displays the master list of recipes from the Veggie Vault API.
 */
const Home = () => {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                setLoading(true);
                const data = await api.getRecipes();
                setRecipes(data.recipes || data);
                setError(null);
            }
            catch (err) {
                setError('Failed to retrieve recipes from the vault. Check the connection');
            }
            finally {
                setLoading(false);
            }
        }
        loadRecipes();
    }, []);

    if (loading) return <div className={styles.loadingState}>Unlocking the Vault...</div>;
    if (error) return <div className={styles.errorState}>{error}</div>;

    return (
    <div className={styles.homeContainer}>
        <h2>Latest Vault Entries</h2>
        <p>Strictly WFPB and Oil-Free</p>
        <div className={styles.recipeGrid}>
            {recipes.length > 0 ? (
                recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))
            ) : (
                <p>The Vault is Empty. Add Some Recipes.</p>
            )}
        </div>
    </div>
  );
}
export default Home;