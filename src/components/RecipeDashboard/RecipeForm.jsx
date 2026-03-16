import React, { useState } from 'react';

const RecipeForm = ({ onGenerate, isLoading, isBroke, isChatMode }) => {
  // Local state to track what the user is typing and the toggle switch
  const [userRequest, setUserRequest] = useState('');
  const [isOilFree, setIsOilFree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Don't let them submit air
    if (!userRequest.trim()) return;

    // Pass the goods up to the Dashboard
    onGenerate(userRequest, isOilFree);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      
      <div className="input-group">
        <label htmlFor="recipe-request">{isChatMode ? "Ask Emma a question..." : "What are you craving, then?"}</label>
        <textarea
          id="recipe-request"
          value={userRequest}
          onChange={(e) => setUserRequest(e.target.value)}
          placeholder={isChatMode ? "Ask Emma a question..." : "E.g., A massive bowl of spicy lentil stew, or a proper good vegan shepherd's pie..."}
          disabled={isLoading}
          rows="4"
          required
        />
      </div>

      {!isChatMode && (
        <div className="toggle-group">
        <label className="switch">
          <input
            type="checkbox"
            checked={isOilFree}
            onChange={(e) => setIsOilFree(e.target.checked)}
            disabled={isLoading}
          />
          {/* You'll need a bit of CSS to make this look like a proper slider switch */}
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
        {isLoading ? "Emma's having a think..." : isChatMode ? "Ask Emma Advanced" : "Generate Recipe"}
      </button>

    </form>
  );
};

export default RecipeForm;