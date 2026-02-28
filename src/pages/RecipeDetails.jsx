import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import NutritionPanel from '../components/NutritionPanel';

const RecipeDetails = () => {
    const {id} = useParams();

    const [recipe, setRecipe] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setloading(true);
                const data = await api.getRecipesById(id);
                setRecipe(data);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setloading(false);
            }
        }

        fetchRecipe();
    }, [id]);

    // Handle our loading and error states
    if (loading) return <div className="vault-loading">Decrypting vault entry...</div>;
    if (error) return <div className="vault-error">Blimey, an error: {error}</div>;
    if (!recipe) return <div className="vault-error">Recipe vanished into the ether.</div>;
    console.log(recipe.nutrition_info);

    return (
      <div className='recipe-details'>
        <header className='recipe-header'>
             <h2>
                {recipe.title}
            </h2>
            <p className='recipe-meta'>
                <strong>Prep:</strong> {recipe.prepTime} | <strong>Cook:</strong> {recipe.cookTime} | <strong>Yields:</strong> {recipe.yields}
            </p>
        </header>
        <section className='oil-free-logic'>
            <h4>🌿 Nutritional Mandate</h4>
            <p>
                {/* Dynamic check for our strict culinary standards */}
                {recipe.isOilFree 
                    ? "This entry complies strictly with the WFPB oil-free mandate." 
                    : "Contains oil. Rationale: [Database mapping for rationale pending]"}
            </p>
        </section>
        <div className='details-grid'>
            <div className="ingredients-and-steps">
            <section className='ingredients-list'>
                <h3>Ingredients</h3>
                <ul>
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ing, index) => (
                            <li key={index}>{ing}</li>
                        ))
                    ) : (
                        <li>No Ingredients Found.</li>
                    )}
                </ul>
            </section>

            <section className='instructions-list'>
                <h3>Instructions</h3>
                <ol className='step-by-step'>
                    {recipe.instructions && recipe.instructions.length > 0 ? (
                                recipe.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))
                            ) : (
                                <li>No instructions provided. Best of luck, mate. Just chuck it all in a pan and hope for the best!</li>
                            )}
                </ol>
            </section>
        </div>
            <section className='nutritional-vault'>
                    <NutritionPanel nutrition={recipe.nutrition_info} />
            </section>
        </div>
      </div>
    );
}
export default RecipeDetails;