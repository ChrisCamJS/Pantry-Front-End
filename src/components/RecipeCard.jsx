import React from 'react';
import {Link} from 'react-router-dom';

/**
 * RecipeCard Component
 * Displays a summary of a single recipe.
 * @param {Object} recipe - The recipe data object (Title, Desc, Macros, etc.)
 */

const Recipecard = ({recipe}) => {
    const {title, description, cookTime, prepTime, isOilFree} = recipe;

    return (
        <div className='recipe-card'>
            <div className='recipe-card-image'>
                <div className='image-placeholder'>WFPB Goodness</div>
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