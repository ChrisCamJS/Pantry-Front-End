import React from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails = () => {
    const {id} = useParams();

    const recipe = {
        title: "Vault-Style Zucchini Lasagna",
        rationale: "We use a cashew-based 'cheese' to maintain a creamy profile without the need for processed oils.",
        ingredients: ["Zucchini", "Cashews", "Nutritional Yeast", "Marinara", "Spinach"],
        macros: { protein: "12g", fat: "8g", carbs: "35g" }
    }

    return (
        <div className='recipe-details'>
            <h2>
                {recipe.title} (Entry #{id})
            </h2>
            <section className='oil-free-logic'>
                <h4>
                    🌿 Oil-Free Rationale
                </h4>
                <p>
                    {recipe.rationale}
                </p>
            </section>

            <div className='details-grid'>
                <section className='ingredients-list'>
                    <h3>
                        Ingredients
                    </h3>
                    <ul>
                        {recipe.ingredients.map((ing, index) => (
                            <li key={index}>{ing}</li>
                        ))}
                    </ul>
                </section>

                <section className='nutritional-vault'>
                        <h3>Macro Breakdown</h3>
                        <p>
                            Protein: {recipe.macros.protein}
                        </p>
                        <p>
                            Fat: {recipe.macros.fat}
                        </p>
                        <p>
                            Carbs: {recipe.macros.carbs}
                        </p>
                </section>
            </div>
        </div>
    )
}

export default RecipeDetails;