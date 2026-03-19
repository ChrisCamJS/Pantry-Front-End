import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { sendChatMessage } from '../../services/geminiApi';
import { getMicroCalculationInstructions } from '../../utils/promptBuilder';

const RecipeResult = ({ recipeMarkdown, imageUrl, isDraft }) => {
  const { user, spendToken } = useAuth();
  const currentUserName = user?.username || 'Guest';

  const [speechState, setSpeechState] = useState('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [advancedMicros, setAdvancedMicros] = useState(null);
  const [isCalculatingMicros, setIsCalculatingMicros] = useState(false);

  useEffect(() => {
    window.speechSynthesis.getVoices();
    return () => {
      window.speechSynthesis.cancel();
      setSpeechState('idle');
    };
  }, []);

  const handleSpeak = () => {
    if (!recipeMarkdown) return;
    if (speechState === 'playing') {
      window.speechSynthesis.pause();
      setSpeechState('paused');
      return;
    }
    if (speechState === 'paused') {
      window.speechSynthesis.resume();
      setSpeechState('playing');
      return;
    }

    window.speechSynthesis.cancel();
    setSpeechState('playing');

    const fullTextToRead = advancedMicros ? `${recipeMarkdown}\n\n${advancedMicros}` : recipeMarkdown;
    const cleanText = fullTextToRead.replace(/[#*`_]/g, '');
    const textChunks = cleanText.split('\n').filter(line => line.trim() !== '');
    const liveVoices = window.speechSynthesis.getVoices();
    
    const britishVoice = liveVoices.find(voice => voice.lang === 'en-GB' && voice.name.includes('Female')) 
                      || liveVoices.find(voice => voice.lang === 'en-GB') 
                      || liveVoices[0];

    textChunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      if (britishVoice) utterance.voice = britishVoice;
      utterance.rate = 1.05; 
      utterance.pitch = 1.1;
      if (index === textChunks.length - 1) utterance.onend = () => setSpeechState('idle');
      utterance.onerror = () => setSpeechState('idle');
      window.speechSynthesis.speak(utterance);
    });
  };

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
        alert(`Cheeky! The till wouldn't open: ${tokenResult.message}`);
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

      const descMatch = recipeMarkdown.match(/^#\s+.+\n+([^#\n]+)/m);
      const description = descMatch ? descMatch[1].trim() : 'A glorious AI-generated WFPB meal.';

      let prepTime = 0; let cookTime = 0; let yields = '';
      const prepMatch = recipeMarkdown.match(/prep(?:aration)?\s*time.*?(?:(\d+)\s*min)/i);
      if (prepMatch) prepTime = parseInt(prepMatch[1], 10);
      const cookMatch = recipeMarkdown.match(/cook\s*time.*?(?:(\d+)\s*min)/i);
      if (cookMatch) cookTime = parseInt(cookMatch[1], 10);
      const yieldMatch = recipeMarkdown.match(/yields?:?\s*(.+?)(?:\n|$)/i);
      if (yieldMatch) yields = yieldMatch[1].trim();

      const ingredientsMatch = recipeMarkdown.match(/##\s*Ingredients([\s\S]*?)(?=##|$)/i);
      const ingredients = ingredientsMatch ? ingredientsMatch[1].split('\n').filter(line => line.trim().match(/^[-*]/)).map(line => line.replace(/^[-*]\s*/, '').trim()) : [];

      const instructionsMatch = recipeMarkdown.match(/##\s*Instructions([\s\S]*?)(?=##|$)/i);
      const instructions = instructionsMatch ? instructionsMatch[1].split('\n').filter(line => line.trim().match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, '').trim()) : [];

      const notesMatch = recipeMarkdown.match(/##\s*Chef's?\s*Notes([\s\S]*?)(?=##|$)/i);
      let notes = notesMatch ? notesMatch[1].trim() : '';

      if (advancedMicros) {
          notes = notes ? `${notes}\n\n### Advanced Nutritional Analysis\n${advancedMicros}` : `### Advanced Nutritional Analysis\n${advancedMicros}`;
      }

      try {
        await api.saveGeneratedRecipe({
          title: recipeTitle, description, imageUrl: imageUrl || '', prepTime, cookTime, yields, ingredients, instructions, notes
        });
        const successMsg = isDraft ? 'Smashing! Your text draft has been locked in the Veggie Vault.' : 'Brilliant! The full recipe and image have been safely vaulted.';
        alert(successMsg);
      } catch (error) {
        console.error('Failed to save to the vault:', error);
        alert('Oh dear. Something went pear-shaped while saving to the database.');
      } finally {
        setIsSaving(false);
      }
  };

  let buttonText = "🗣️ Read Aloud";
  let buttonColor = "#4a5568"; 
  if (speechState === 'playing') {
    buttonText = "⏸️ Pause Emma";
    buttonColor = "#e53e3e"; 
  } else if (speechState === 'paused') {
    buttonText = "▶️ Resume";
    buttonColor = "#48bb78"; 
  }

  if (!recipeMarkdown) return null;

  return (
    <div className="recipe-result-card" style={{ position: 'relative' }}>
      
      {imageUrl && (
        <div className="recipe-image-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img 
                src={imageUrl} 
                alt="A glorious AI-generated WFPB meal" 
                style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
            />
        </div>
      )}

      {/* THE MAGIC TRICK: Sticky Floating Action Bar */}
      <div 
        className="result-actions-sticky" 
        style={{ 
          position: 'sticky', 
          top: '1rem', // How far from the top of the viewport it sticks
          zIndex: 100, 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white
          backdropFilter: 'blur(8px)', // Gorgeous glass effect
          padding: '1rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}
      >
        <button 
          onClick={handleSaveToVault}
          disabled={isSaving}
          className="vault-btn"
          style={{
            backgroundColor: isSaving ? '#a0aec0' : '#805ad5', color: 'white', padding: '0.75rem 1.5rem', border: 'none',
            borderRadius: '8px', cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s', fontSize: '1rem'
          }}
        >
          {isSaving ? '🔒 Vaulting...' : (isDraft ? '📝 Save Draft to Vault' : '📸 Save Full Recipe')}
        </button>

        <button 
          onClick={handleDownload}
          className="download-btn"
          style={{
            backgroundColor: '#2b6cb0', color: 'white', padding: '0.75rem 1.5rem', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s', fontSize: '1rem'
          }}
        >
          💾 Local Copy
        </button>

        <button 
          onClick={handleSpeak} 
          className="speak-btn"
          style={{
            backgroundColor: buttonColor, color: 'white', padding: '0.75rem 1.5rem', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s', fontSize: '1rem'
          }}
        >
          {buttonText}
        </button>
      </div>

      <div className="recipe-content">
        <ReactMarkdown>
          {recipeMarkdown}
        </ReactMarkdown>
      </div>

      {advancedMicros && (
          <div className="advanced-micros-content" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#faf5ff', borderRadius: '12px', border: '1px solid #d6bcfa' }}>
              <h3 style={{ color: '#6b46c1', marginTop: 0 }}>🔬 Emma's Deep Dive Analysis</h3>
              <ReactMarkdown>{advancedMicros}</ReactMarkdown>
          </div>
      )}

      {!advancedMicros && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button 
                onClick={handleCalculateMicros}
                disabled={isCalculatingMicros}
                style={{
                    backgroundColor: isCalculatingMicros ? '#e2e8f0' : '#ebf4ff', color: isCalculatingMicros ? '#a0aec0' : '#3182ce',
                    border: '1px solid #63b3ed', padding: '0.5rem 1rem', borderRadius: '20px', cursor: isCalculatingMicros ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold', transition: 'all 0.2s'
                }}
              >
                  {isCalculatingMicros ? '🧮 Crunching the numbers...' : '🔬 Calculate Full Macros and Micros (0.1 Tokens)'}
              </button>
          </div>
      )}
      
      <div className="recipe-footer" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096' }}>
        <p><em>Generated by Emma Advanced for The Chris and Emma Show Premium Vault.</em></p>
      </div>
    </div>
  );
};

export default RecipeResult;