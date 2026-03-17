import React from 'react';
import {Link} from 'react-router-dom';
import './RecipeCard.css';

/**
 * RecipeCard Component
 * Displays a summary of a single recipe.
 * @param {Object} recipe - The recipe data object
 */

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Recipecard = ({recipe}) => {
    const {title, description, cookTime, prepTime, isOilFree, imageUrl, averageRating, nutritionInfo, ingredients, notes, yields, ratingCount, authorId} = recipe;

    const targetImage = recipe?.imageUrl || recipe?.image_url; 

    const fullImageUrl = targetImage 
        ? (targetImage.startsWith('http') ? targetImage : `${API_URL}${targetImage}`)
        : '/belle-house-fiesta-bowl.jpg'; // Optional fallback

    return (
        <div className='recipe-card'>
            <div className='recipe-card-image'>
                <img src={fullImageUrl} alt={recipe.title} style={{width: '100%', height: 'auto'}} />
            </div>

            <div className='recipe-card-content'>
                <h3 className='recipe-title'>
                    {title}
                </h3>
                <p className='recipe-description'>
                    {description.slice(0, 200) + '...'}
                </p>
                                <div className='recipe-stats'>
                    <span className='prep-time'>⏱️ Prep: {prepTime}m</span>
                    <span className='cook-time'>🔥 Cook: {cookTime}m</span>
                    {isOilFree && (
                        <div className='oil-free-badge'>
                            🌿 Oil-Free
                        </div>
                    )}
                </div>
                <Link to={`/recipe/${recipe.id}`} className='view-recipe-btn'>
                    View Full Recipe
                </Link>
            </div>


        </div>
    )
}

export default Recipecard;