// src/pages/EmmasRecipeEngine.jsx

import React, { useState, useEffect } from 'react';
import { getSystemInstructions } from '../../utils/promptBuilder';
import { sendChatMessage, generateRecipeImage } from '../../services/geminiApi'; 
import { useAuth } from '../../context/AuthContext';
import RecipeForm from './RecipeForm';
import RecipeResult from './RecipeResult';
import './EmmasRecipeEngine.css';

const EmmasRecipeEngine = () => {
    const { user, spendToken } = useAuth();
    const currentUserName = user?.username || 'Guest';

    const [chatHistory, setChatHistory] = useState([]);
    const [recipeImage, setRecipeImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [followUpText, setFollowUpText] = useState('');
    const [currentIsOilFree, setCurrentIsOilFree] = useState(true);

    // 3-way state -> 'full', 'draft', or 'chat'
    const [engineMode, setEngineMode] = useState('full');

    // Bottom Bin Button State
    const [showBottomBin, setShowBottomBin] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
        // If they've scrolled down more than 300px, show the button
        if (window.scrollY > 300) {
            setShowBottomBin(true);
        } else {
            setShowBottomBin(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    
    // The cleanup
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

    const processChatTurn = async (newUserMessageText, isOilFreeSetting) => {
        
        // --- THE BOUNCER AND THE TOLLBOOTH ---
        if (engineMode === 'full') {
            if (user?.generation_tokens <= 0) {
                alert("Oh dear, love! Your token stash is completely empty. Switch to a Free mode or top up to keep generating images.");
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
            const isChatActive = engineMode === 'chat';
            const systemInstructions = getSystemInstructions(isOilFreeSetting, currentUserName, isChatActive);
            
            if (engineMode === 'full' && chatHistory.length === 0) {
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
        
        const formattedRequest = engineMode === 'chat' 
            ? userRequest 
            : `I want a recipe for: ${userRequest}`;
            
        processChatTurn(formattedRequest, isOilFree);
    };

    const handleFollowUpSubmit = (e) => {
        e.preventDefault();
        if (!followUpText.trim()) return;
        
        const messageToSend = followUpText;
        setFollowUpText(''); 
        processChatTurn(messageToSend, currentIsOilFree);
    };

    const isBroke = user?.generation_tokens <= 0;

    const getModeButtonStyle = (modeName) => {
        const isSelected = engineMode === modeName;
        return {
            cursor: 'pointer',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: `2px solid ${isSelected ? '#805ad5' : '#e2e8f0'}`,
            backgroundColor: isSelected ? '#faf5ff' : 'white',
            color: isSelected ? '#805ad5' : '#4a5568',
            fontWeight: isSelected ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease-in-out',
            flex: '1',
            justifyContent: 'center'
        };
    };

    // A helper function so we don't repeat our binning logic
    const handleResetEngine = () => {
        setChatHistory([]);
        setRecipeImage(null);
        setFollowUpText('');
        setError(null);
    };

    return (
        <div className="recipe-dashboard-container">
            <header className="dashboard-header">
                <h2>Emma's Premium Engine</h2>
                <p>Strictly WFPB. Full Macros. Live Banter Enabled.</p>
            </header>

            {chatHistory.length === 0 && (
                <>
                    <div className="mode-selector-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <label style={getModeButtonStyle('full')}>
                            <input type="radio" name="engineMode" value="full" checked={engineMode === 'full'} onChange={(e) => setEngineMode(e.target.value)} style={{ display: 'none' }} />
                            📸 Full Recipe (1 Token)
                        </label>
                        <label style={getModeButtonStyle('draft')}>
                            <input type="radio" name="engineMode" value="draft" checked={engineMode === 'draft'} onChange={(e) => setEngineMode(e.target.value)} style={{ display: 'none' }} />
                            📝 Text Draft (Free)
                        </label>
                        <label style={getModeButtonStyle('chat')}>
                            <input type="radio" name="engineMode" value="chat" checked={engineMode === 'chat'} onChange={(e) => setEngineMode(e.target.value)} style={{ display: 'none' }} />
                            💬 Nutrition Natter (Free)
                        </label>
                    </div>

                    <RecipeForm 
                        onGenerate={handleInitialGenerate} 
                        isLoading={isLoading} 
                        isBroke={isBroke && engineMode === 'full'} 
                        engineMode={engineMode}
                    />
                </>
            )}

            {error && (
                <div className="error-banner">
                    <p><strong>Oi!</strong> {error}</p>
                </div>
            )}

            {chatHistory.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button 
                        onClick={handleResetEngine}
                        disabled={isLoading}
                        style={{ 
                            background: '#fed7d7', 
                            color: '#c53030', 
                            border: '1px solid #fc8181', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '6px', 
                            cursor: isLoading ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: isLoading ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        New Chat
                    </button>
                </div>
            )}

            <div className="chat-container" style={{ marginTop: '1rem' }}>
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
                                isDraft={engineMode === 'draft'} 
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
                        placeholder={(isBroke && engineMode === 'full') ? "Out of tokens!" : "Talk back to Emma..."}
                        disabled={isLoading || (isBroke && engineMode === 'full')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e0', backgroundColor: (isBroke && engineMode === 'full') ? '#edf2f7' : 'white' }}
                    />
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={isLoading || !followUpText.trim() || (isBroke && engineMode === 'full')}
                        style={{ cursor: (isLoading || (isBroke && engineMode === 'full')) ? 'not-allowed' : 'pointer' }}
                    >
                        {isLoading ? "Thinking..." : ((isBroke && engineMode === 'full') ? "🪙 Skint" : "Send")}
                    </button>
                </form>
            )}
            
            {/* THE ORIGINAL 'BIN IT' BUTTON */}
            {chatHistory.length > 0 && !isLoading && showBottomBin && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
                    <button 
                        onClick={handleResetEngine}
                        disabled={isLoading}
                        style={{ 
                            background: '#fed7d7', 
                            color: '#c53030', 
                            border: '1px solid #fc8181', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '6px', 
                            cursor: isLoading ? 'not-allowed' : 'pointer', 
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: isLoading ? 0.6 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        New Chat
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmmasRecipeEngine;