// src/components/RecipeDashboard/RecipeForm.jsx

import React, { useState } from 'react';

const RecipeForm = ({ onGenerate, isLoading, isBroke, engineMode }) => {
  const [userRequest, setUserRequest] = useState('');
  const [isOilFree, setIsOilFree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userRequest.trim()) return;
    onGenerate(userRequest, isOilFree);
  };

  // Determine the placeholder based on mode
  const getPlaceholder = () => {
    if (engineMode === 'chat') return "E.g., What are the best plant-based sources of iron, Emma?";
    return "E.g., A massive bowl of spicy lentil stew, or a proper good vegan shepherd's pie...";
  };

  // Determine the label based on mode
  const getLabel = () => {
    if (engineMode === 'chat') return "Ask Emma a question...";
    return "What are you craving, then?";
  };

  // Determine the button text
  const getButtonText = () => {
      if (isLoading) return "Emma's having a think...";
      if (engineMode === 'chat') return "Chat with Emma";
      if (engineMode === 'draft') return "Generate Draft (Free)";
      return "Generate Full Recipe";
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      
      <div className="input-group">
        <label htmlFor="recipe-request">{getLabel()}</label>
        <textarea
          id="recipe-request"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={isLoading}
          rows="4"
          required
        />
      </div>

      {/* Only show the Oil-Free toggle if we are actually making a recipe! */}
      {engineMode !== 'chat' && (
          <div className="toggle-group">
            <label className="switch">
              <input
                type="checkbox"
                checked={isOilFree}
                onChange={(e) => setIsOilFree(e.target.checked)}
                disabled={isLoading}
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">
              {isOilFree ? "Strictly Oil-Free" : "Allow Oil (Requires strict justification!)"}
            </span>
          </div>
      )}

      <button 
        type="submit" 
        className="submit-btn" 
        disabled={isBroke || isLoading || !userRequest.trim()}
      >
        {getButtonText()}
      </button>

    </form>
  );
};

export default RecipeForm;