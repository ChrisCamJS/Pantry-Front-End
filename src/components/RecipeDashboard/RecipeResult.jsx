import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage } from '../../services/geminiApi';
import { getMicroCalculationInstructions } from '../../utils/promptBuilder';
import { useEmmaVoice } from '../../hooks/useEmmaVoice';
import './RecipeResult.css';

const RecipeResult = ({ recipeMarkdown, imageUrl, isDraft, isChat }) => {
  const { user, spendToken } = useAuth();
  const currentUserName = user?.username || 'Love';

  const [isSaving, setIsSaving] = useState(false);
  const [advancedMicros, setAdvancedMicros] = useState(null);
  const [isCalculatingMicros, setIsCalculatingMicros] = useState(false);

  // Initialize the voice hook
  const { speechState, handleSpeak } = useEmmaVoice();

  const handleDownload = () => {
    if (!recipeMarkdown) return;
    let filename = isDraft ? 'emma-wfpb-draft.md' : 'emma-wfpb-recipe.md';
    const titleMatch = recipeMarkdown.match(/^#\s+(.+)$/m);
    if (titleMatch && titleMatch[1]) {
      const safeTitle = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      filename = `${safeTitle}.md`;
    }
    const finalOutput = advancedMicros ? `${recipeMarkdown}\n\n## Advanced Analysis\n${advancedMicros}` : recipeMarkdown;
    const blob = new Blob([finalOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCalculateMicros = async () => {
    const tokenCost = 0.1;
    if (user?.generation_tokens < tokenCost) {
        alert("Oh dear! Your token stash is a bit too light for this deep dive. Time to top up!");
        return;
    }
    const tokenResult = await spendToken(tokenCost);
    if (!tokenResult.success) {
        alert(`Uh oh! The till wouldn't open: ${tokenResult.message}`);
        return;
    }

    setIsCalculatingMicros(true);
    try {
        const instructions = getMicroCalculationInstructions(currentUserName);
        const chatHistory = [{ role: 'user', parts: [{ text: `Here is the recipe I need you to deeply analyze:\n\n${recipeMarkdown}` }] }];
        const mathResult = await sendChatMessage(chatHistory, instructions);
        setAdvancedMicros(mathResult);
    } catch (err) {
        console.error("Math API threw a pear:", err);
        alert("Emma dropped her calculator. Something went wrong gathering the micros, please try again.");
    } finally {
        setIsCalculatingMicros(false);
    }
  };

  const handleSaveToVault = async () => {
      if (!recipeMarkdown) return;
      setIsSaving(true);
      
      let recipeTitle = 'Untitled Emma Masterpiece';
      const titleMatch = recipeMarkdown.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) recipeTitle = titleMatch[1].trim();

      const descMatch = recipeMarkdown.match(/^#\s+[^\n]+\n+([\s\S]*?)(?=\n\*\*|\n##)/);
      const description = descMatch ? descMatch[1].trim() : 'A glorious AI-generated WFPB meal.';

      let prepTime = 0; let cookTime = 0; let yields = '';
      const prepMatch = recipeMarkdown.match(/prep(?:aration)?\s*time.*?(?:(\d+)\s*min)/i);
      if (prepMatch) prepTime = parseInt(prepMatch[1], 10);
      const cookMatch = recipeMarkdown.match(/cook\s*time.*?(?:(\d+)\s*min)/i);
      if (cookMatch) cookTime = parseInt(cookMatch[1], 10);
      const yieldMatch = recipeMarkdown.match(/yields?:?\s*(.+?)(?:\n|$)/i);
      if (yieldMatch) yields = yieldMatch[1].trim();

      const ingredientsMatch = recipeMarkdown.match(/##\s*Ingredients([\s\S]*?)(?=\n##\s*(?:Instructions|Nutrition Information|Chef's Notes)|$)/i);
      const ingredients = ingredientsMatch ? ingredientsMatch[1].split('\n').filter(line => line.trim().match(/^[-*]/)).map(line => line.replace(/^[-*]\s*/, '').trim()) : [];

      const instructionsMatch = recipeMarkdown.match(/##\s*Instructions([\s\S]*?)(?=\n##\s*(?:Nutrition Information|Chef's Notes)|$)/i);
      const instructions = instructionsMatch ? instructionsMatch[1].split('\n').filter(line => line.trim().match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, '').trim()) : [];

      const notesMatch = recipeMarkdown.match(/##\s*Chef's?\s*Notes([\s\S]*?)(?=##|$)/i);
      let notes = notesMatch ? notesMatch[1].trim() : '';

      if (advancedMicros) {
          notes = notes ? `${notes}\n\n### Advanced Nutritional Analysis\n${advancedMicros}` : `### Advanced Nutritional Analysis\n${advancedMicros}`;
      }

      let calories = 0, protein_g = 0, carbs_g = 0, fat_g = 0, fiber_g = 0;
      const calMatch = recipeMarkdown.match(/Calories:\s*(\d+)/i);
      if (calMatch) calories = parseInt(calMatch[1], 10);
      
      const proMatch = recipeMarkdown.match(/Protein:\s*(\d+)/i);
      if (proMatch) protein_g = parseInt(proMatch[1], 10);
      
      const carbMatch = recipeMarkdown.match(/Carbs:\s*(\d+)/i);
      if (carbMatch) carbs_g = parseInt(carbMatch[1], 10);
      
      const fatMatch = recipeMarkdown.match(/Fat:\s*(\d+)/i);
      if (fatMatch) fat_g = parseInt(fatMatch[1], 10);

      const fiberMatch = recipeMarkdown.match(/Fiber:\s*(\d+)/i);
      if (fiberMatch) fiber_g = parseInt(fiberMatch[1], 10);

      try {
          await api.saveGeneratedRecipe({
          title: recipeTitle, 
          description, 
          imageUrl: imageUrl || '', 
          prepTime, 
          cookTime, 
          yields, 
          ingredients, 
          instructions, 
          notes,
          calories,
          protein_g,
          carbs_g,
          fat_g,
          fiber_g
        });
        const successMsg = isDraft ? 'Smashing! Your recipe draft has been locked in the Veggie Vault.' : 'Brilliant! The full recipe and image have been safely vaulted.';
        alert(successMsg);
      } catch (error) {
        console.error('Failed to save to the vault:', error);
        alert('Oh dear. Something went pear-shaped while saving to the database.');
      } finally {
        setIsSaving(false);
      }
  };

  // Dynamic Button UI for Speech
  let speakBtnText = "🗣️ Read Aloud";
  let speakBtnClass = "speak-btn-idle"; 
  if (speechState === 'playing') {
    speakBtnText = "⏸️ Pause Emma";
    speakBtnClass = "speak-btn-playing"; 
  } else if (speechState === 'paused') {
    speakBtnText = "▶️ Resume";
    speakBtnClass = "speak-btn-paused"; 
  }

  if (!recipeMarkdown) return null;

  return (
    <div className="recipe-result-card">
      
      {imageUrl && (
        <div className="recipe-image-container">
            <img src={imageUrl} alt="A glorious AI-generated WFPB meal" />
        </div>
      )}

      {/* THE MAGIC TRICK: Sticky Floating Action Bar */}
      <div className="result-actions-sticky">
        {/* Only show Vault and Download if we aren't just nattering */}
        {!isChat && (
            <>
                <button 
                onClick={handleSaveToVault}
                disabled={isSaving}
                className={`action-btn vault-btn ${isSaving ? 'saving' : ''}`}
                >
                {isSaving ? '🔒 Vaulting...' : (isDraft ? '📝 Save Draft to Vault' : '📸 Save Full Recipe')}
                </button>

                <button onClick={handleDownload} className="action-btn download-btn">
                💾 Local Copy
                </button>
            </>
        )}

        <button 
          onClick={() => handleSpeak(advancedMicros ? `${recipeMarkdown}\n\n${advancedMicros}` : recipeMarkdown)} 
          className={`action-btn speak-btn ${speakBtnClass}`}
        >
          {speakBtnText}
        </button>
      </div>

      <div className="recipe-content">
        <ReactMarkdown>{recipeMarkdown}</ReactMarkdown>
      </div>

      {advancedMicros && (
          <div className="advanced-micros-content">
              <h3>🔬 Emma's Deep Dive Analysis</h3>
              <ReactMarkdown>{advancedMicros}</ReactMarkdown>
          </div>
      )}

      {/* Hide the calculation button if we are in chat mode OR if it's already calculated */}
      {!isChat && !advancedMicros && (
          <div className="calc-micros-container">
              <button 
                onClick={handleCalculateMicros}
                disabled={isCalculatingMicros}
                className={`calc-micros-btn ${isCalculatingMicros ? 'calculating' : ''}`}
              >
                  {isCalculatingMicros ? '🧮 Crunching the numbers...' : '🔬 Calculate Full Macros and Micros (0.1 Tokens)'}
              </button>
          </div>
      )}
      
      <div className="recipe-footer">
        <p><em>Generated by Emma Advanced for The Chris and Emma Show Premium Vault.</em></p>
      </div>
    </div>
  );
};

export default RecipeResult;