import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import NutritionPanel from '../components/NutritionPanel';
// ============================================================================
// COMPONENT: RecipeDetails
// PURPOSE: Fetches and displays a single recipe from the Headless PHP API.
// ============================================================================

const API_URL = import.meta.env.VITE_API_BASE_URL;

const RecipeDetails = () => {
  // --- STATE & ROUTING ---
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING (useEffect) ---
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await api.getRecipesById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

    const targetImage = recipe?.imageUrl || recipe?.image_url; 

    const fullImageUrl = targetImage 
        ? (targetImage.startsWith('http') ? targetImage : `${API_URL}${targetImage}`)
        : '/belle-house-fiesta-bowl.jpg'; // Optional fallback

  // --- CONDITIONAL RENDERING (Guards) ---

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
        <span className="ml-3 text-purple-600 font-bold">Decrypting vault entry...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
        <h3 className="font-bold text-lg">Blimey, an error occurred!</h3>
        <p>{error}</p>
        <Link to="/" className="text-red-900 underline mt-2 inline-block">Return to the Pantry</Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-center">
        Recipe vanished into the ether.
      </div>
    );
  }

  // --- THE UI RENDER ---
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
          &larr; Back to Recipe Grid
        </Link>
      </div>
      <div className='p-1 w-full'>
        <img src={fullImageUrl} alt={recipe.title || 'A glorious WFPB meal'} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <header className="bg-gradient-to-r from-purple-800 to-indigo-900 px-6 py-10 sm:px-10 text-white text-center sm:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {recipe.title}
          </h1>
          
          {recipe.description && (
            <p className="text-lg text-purple-200 mb-6 max-w-3xl">
              {recipe.description}
            </p>
          )}

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              ⏱ Prep: {recipe.prepTime}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              🔥 Cook: {recipe.cookTime}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              🍽 Yields: {recipe.yields}
            </span>
          </div>
        </header>

        {/* CHEF'S NOTES */}
        {recipe.notes && (
          <div className="bg-yellow-50 border-b border-yellow-100 p-6 sm:px-10">
            <h4 className="font-bold text-yellow-800 flex items-center mb-2">
              <span className="mr-2">📝</span> Chef's Notes & Rationales
            </h4>
            <p className="text-yellow-900 text-sm">
              {recipe.notes}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10">
          
          {/* Left Column: Ingredients & Instructions */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Ingredients */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-100 pb-2 mb-4 list-none">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-700">{ing}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No Ingredients Found.</li>
                )}
              </ul>
            </section>

            {/* Instructions */}
            <section>
              <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-100 pb-2 mb-4">
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions && recipe.instructions.length > 0 ? (
                  recipe.instructions.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 mt-1">{step}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">
                    No instructions provided. Best of luck, mate. Just chuck it all in a pan and hope for the best!
                  </li>
                )}
              </ol>
            </section>
          </div>

          {/* Right Column: Nutrition Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <NutritionPanel nutrition={recipe.nutrition_info} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;