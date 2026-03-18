// src/pages/EmmasRecipeEngine.jsx

import React, { useState } from 'react';
import { getSystemInstructions } from '../../utils/promptBuilder';
import { sendChatMessage, generateRecipeImage } from '../../services/geminiApi'; 
import { useAuth } from '../../context/AuthContext';
import RecipeForm from './RecipeForm';
import RecipeResult from './RecipeResult';
import './EmmasRecipeEngine.css';

const EmmasRecipeEngine = () => {
    // Grab the logged-in user and the spendToken function!
    const { user, spendToken } = useAuth();
    // Fallback to 'Guest' just in case
    const currentUserName = user?.username || 'Guest';

    const [chatHistory, setChatHistory] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [followUpText, setFollowUpText] = useState('');
    const [currentIsOilFree, setCurrentIsOilFree] = useState(true);

    const [isChatMode, setIsChatMode] = useState(false);

const processChatTurn = async (newUserMessageText, isOilFreeSetting) => {
        
        // --- STEP A & B: THE BOUNCER AND THE TOLLBOOTH (RECIPES ONLY) ---
        if (!isChatMode) {
            if (user?.generation_tokens <= 0) {
                alert("Oh dear, love! Your token stash is completely empty. Time to top up to keep generating full recipes with images.");
                return; 
            }

            const tokenResult = await spendToken();
            
            if (!tokenResult.success) {
                alert(`Cheeky! The till wouldn't open: ${tokenResult.message}`);
                return; 
            }
        }
        // --- END OF TOLLBOOTH ---

        setIsLoading(true);
        setError(null);
        setCurrentIsOilFree(isOilFreeSetting);

        const updatedHistory = [
            ...chatHistory, 
            { role: 'user', parts: [{ text: newUserMessageText }] }
        ];

        try {
            const systemInstructions = getSystemInstructions(isOilFreeSetting, currentUserName, isChatMode);
            
            // ONLY generate an image if they are paying for a recipe!
            if (!isChatMode && chatHistory.length === 0) {
                generateRecipeImage(newUserMessageText)
                    .then(base64Data => {
                        if (base64Data) {
                            setRecipeImage(`data:image/jpeg;base64,${base64Data}`);
                        }
                    })
                    .catch(err => console.error("The image generation threw a pear:", err));
            }

            const modelReplyText = await sendChatMessage(updatedHistory, systemInstructions);

            setChatHistory([
                ...updatedHistory,
                { role: 'model', parts: [{ text: modelReplyText }] }
            ]);

        } catch (err) {
            console.error("Dashboard caught an error:", err);
            setError(err.message || "Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleInitialGenerate = (userRequest, isOilFree) => {
        setChatHistory([]);
        setRecipeImage(null); 
        processChatTurn(`I want a recipe for: ${userRequest}`, isOilFree);
    };

    const handleFollowUpSubmit = (e) => {
        e.preventDefault();
        if (!followUpText.trim()) return;
        
        const messageToSend = followUpText;
        setFollowUpText(''); 
        processChatTurn(messageToSend, currentIsOilFree);
    };

    // A quick check to see if they are broke, so we can disable UI elements
    const isBroke = user?.generation_tokens <= 0;

    return (
        <div className="recipe-dashboard-container">
            <header className="dashboard-header">
                <h2>Emma's Premium Recipe Generator</h2>
                <p>Strictly WFPB. Full Macros. Live Banter Enabled.</p>
            </header>

            {chatHistory.length === 0 && (
                <>
                    {/* The Mode Toggle */}
                    <div className="mode-toggle-container" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: !isChatMode ? 'bold' : 'normal', color: !isChatMode ? '#805ad5' : '#718096' }}>
                            🍲 Recipe Generator (1 Token)
                        </span>
                        
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                            <input 
                                type="checkbox" 
                                checked={isChatMode} 
                                onChange={() => setIsChatMode(!isChatMode)} 
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span className="slider round" style={{ 
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                backgroundColor: isChatMode ? '#48bb78' : '#cbd5e0', 
                                transition: '.4s', borderRadius: '34px' 
                            }}>
                                <span style={{
                                    position: 'absolute', content: '""', height: '16px', width: '16px', 
                                    left: isChatMode ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                    transition: '.4s', borderRadius: '50%'
                                }} />
                            </span>
                        </label>
                        
                        <span style={{ fontWeight: isChatMode ? 'bold' : 'normal', color: isChatMode ? '#48bb78' : '#718096' }}>
                            💬 Nutrition Natter (Free)
                        </span>
                    </div>

                    {/* The Form */}
                    <RecipeForm 
                        onGenerate={handleInitialGenerate} 
                        isLoading={isLoading} 
                        // Only lock them out if they are broke AND trying to use Recipe Mode
                        isBroke={isBroke && !isChatMode} 
                        isChatMode={isChatMode}
                    />
                </>
            )}

            {error && (
                <div className="error-banner">
                    <p><strong>Oi!</strong> {error}</p>
                </div>
            )}

            <div className="chat-container" style={{ marginTop: '2rem' }}>
                {chatHistory.map((msg, index) => {
                    if (msg.role === 'user') {
                        return (
                            <div key={index} style={{ textAlign: 'right', margin: '1rem 0', color: '#4a5568', fontStyle: 'italic' }}>
                                <strong>{currentUserName}:</strong> {msg.parts[0].text}
                            </div>
                        )
                    } else {
                        return (
                            <RecipeResult 
                                key={index} 
                                recipeMarkdown={msg.parts[0].text} 
                                imageUrl={index === 1 ? recipeImage : null} 
                            />
                        )
                    }
                })}
            </div>

            {chatHistory.length > 0 && (
                <form onSubmit={handleFollowUpSubmit} style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder={isBroke ? "Out of tokens!" : "Talk back to Emma (e.g., 'Swap the lentils for chickpeas, please!')"}
                        disabled={isLoading || isBroke}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: isBroke ? '#edf2f7' : 'white' }}
                    />
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading || !followUpText.trim() || isBroke}
                        style={{ cursor: (isLoading || isBroke) ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Thinking..." : (isBroke ? "🪙 Skint" : "Send")}
                    </button>
                </form>
            )}
            
            {chatHistory.length > 0 && !isLoading && (
                 <button 
                    onClick={() => {
                        setChatHistory([]);
                        setRecipeImage(null);
                    }}
                    style={{ marginTop: '1rem', background: 'transparent', color: '#e53e3e', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                 >
                    Bin this and start a new recipe
                 </button>
            )}
        </div>
    );
};

export default EmmasRecipeEngine;