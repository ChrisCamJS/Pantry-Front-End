import React from 'react';
import RecipeCard from '../components/RecipeCard';



const Home = () => {

    const sampleRecipes = [
    {
      id: 1,
      title: "Iron-Rich Lentil Stew",
      description: "A hearty, oil-free stew packed with greens and savory spices.",
      prepTime: 15,
      cookTime: 45,
      isOilFree: true
    },
    {
      id: 2,
      title: "Vault-Style Zucchini Lasagna",
      description: "Layered with cashew 'cheese' and house-made marinara.",
      prepTime: 30,
      cookTime: 60,
      isOilFree: true
    }
  ];

    return (
    <div className="home-container">
      <h2>Welcome to The Veggie Vault</h2>
      <p>Your high-security stash of strictly WFPB goodness.</p>
      
      {/* Eventually, this is where we will map over our array of recipes 
        fetched from the PHP backend and render our individual RecipeCard components.
      */}
      <div className="recipe-grid">
        {sampleRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Home;