import React from 'react';
import {Link} from 'react-router-dom';

/**
 * RecipeCard Component
 * Displays a summary of a single recipe.
 * @param {Object} recipe - The recipe data object
 */

const Recipecard = ({recipe}) => {
    const {title, description, cookTime, prepTime, isOilFree, imageUrl, averageRating, nutritionInfo, ingredients, notes, yields, ratingCount, authorId} = recipe;

    // console.log(recipe);

    return (
        <div className='recipe-card'>
            <div className='recipe-card-image'>
                <img src={recipe.imageUrl} alt={recipe.title} style={{width: '100%', height: 'auto'}} />
            </div>

            <div className='recipe-card-content'>
                <h3>
                    {title}
                </h3>
                <p className='recipe-description'>
                    {description}
                </p>
                <div className='recipe-stats'>
                    <span>⏱️ Prep: {prepTime}m</span>
                    <span>🔥 Cook: {cookTime}m</span>
                </div>
                {isOilFree && (
                    <div className='oil-free-badge'>
                        🌿 Strictly Oil-Free
                    </div>
                )}
                <Link to={`/recipe/${recipe.id}`} className='view-recipe-button'>
                    View Vault Entry
                </Link>
            </div>


        </div>
    )
}

export default Recipecard;