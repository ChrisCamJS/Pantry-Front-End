import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api'; // Make sure this path is spot on!

const RecipeResult = ({ recipeMarkdown, imageUrl }) => {
  const [speechState, setSpeechState] = useState('idle'); // 'idle', 'playing', or 'paused'
  const [isSaving, setIsSaving] = useState(false); // Keeps eager clickers at bay

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

    const cleanText = recipeMarkdown.replace(/[#*`_]/g, '');
    const textChunks = cleanText.split('\n').filter(line => line.trim() !== '');
    const liveVoices = window.speechSynthesis.getVoices();
    
    const britishVoice = liveVoices.find(voice => voice.lang === 'en-GB' && voice.name.includes('Female')) 
                      || liveVoices.find(voice => voice.lang === 'en-GB') 
                      || liveVoices[0];

    textChunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      
      if (britishVoice) {
        utterance.voice = britishVoice;
      }
      
      utterance.rate = 1.05; 
      utterance.pitch = 1.1;

      if (index === textChunks.length - 1) {
        utterance.onend = () => setSpeechState('idle');
      }
      
      utterance.onerror = () => setSpeechState('idle');

      window.speechSynthesis.speak(utterance);
    });
  };

  const handleDownload = () => {
    if (!recipeMarkdown) return;

    let filename = 'emma-wfpb-recipe.md';
    const titleMatch = recipeMarkdown.match(/^#\s+(.+)$/m);
    
    if (titleMatch && titleMatch[1]) {
      const safeTitle = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      filename = `${safeTitle}.md`;
    }

    const blob = new Blob([recipeMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- THE NEW VAULT SAVE FUNCTION ---
  const handleSaveToVault = async () => {
      if (!recipeMarkdown) return;
      setIsSaving(true);

      // Grab the title
      let recipeTitle = 'Untitled Emma Masterpiece';
      const titleMatch = recipeMarkdown.match(/^#\s+(.+)$/m);
      if (titleMatch && titleMatch[1]) {
        recipeTitle = titleMatch[1].trim();
      }

      // Clever girl regex to extract times and yields
      let prepTime = 0;
      let cookTime = 0;
      let yields = '';

      const prepMatch = recipeMarkdown.match(/prep(?:aration)?\s*time.*?(?:(\d+)\s*min)/i);
      if (prepMatch) prepTime = parseInt(prepMatch[1], 10);

      const cookMatch = recipeMarkdown.match(/cook\s*time.*?(?:(\d+)\s*min)/i);
      if (cookMatch) cookTime = parseInt(cookMatch[1], 10);

      const yieldMatch = recipeMarkdown.match(/yields?:?\s*(.+?)(?:\n|$)/i);
      if (yieldMatch) yields = yieldMatch[1].trim();

      try {
        await api.saveGeneratedRecipe({
          title: recipeTitle,
          content: recipeMarkdown, // Send the whole massive string
          imageUrl: imageUrl || '',
          prepTime,
          cookTime,
          yields
        });
        
        alert('Smashing! The recipe has been safely locked in the Veggie Vault for Admin review. Admin Review can currently take 12-24 hours. It is needed to prevent saving recipes that contain animal products by mistake. This will be automated and instantaneous in a future update.');
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
    <div className="recipe-result-card">
      
      {/* Action Bar now has three buttons nicely aligned */}
      <div className="result-actions" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        
        {/* The New Save to Vault Button */}
        <button 
          onClick={handleSaveToVault}
          disabled={isSaving}
          className="vault-btn"
          style={{
            backgroundColor: isSaving ? '#a0aec0' : '#805ad5', // A royal purple for the vault
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {isSaving ? '🔒 Vaulting...' : '🔒 Save to Vault'}
        </button>

        <button 
          onClick={handleDownload}
          className="download-btn"
          style={{
            backgroundColor: '#2b6cb0', 
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          💾 Local Copy
        </button>

        <button 
          onClick={handleSpeak} 
          className="speak-btn"
          style={{
            backgroundColor: buttonColor,
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
          }}
        >
          {buttonText}
        </button>
      </div>

      {imageUrl && (
        <div className="recipe-image-container" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img 
                src={imageUrl} 
                alt="A glorious AI-generated WFPB meal" 
                style={{ 
                    maxWidth: '100%', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }} 
            />
        </div>
      )}

      <div className="recipe-content">
        <ReactMarkdown>
          {recipeMarkdown}
        </ReactMarkdown>
      </div>
      
      <div className="recipe-footer">
        <p><em>Generated by Emma Advanced for The Chris and Emma Show Premium Vault.</em></p>
      </div>
    </div>
  );
};

export default RecipeResult;