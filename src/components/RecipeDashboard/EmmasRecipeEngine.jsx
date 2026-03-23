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
    const currentUserName = user?.username || 'Love';

    // Start with a completely empty chat history
    const [chatHistory, setChatHistory] = useState([]);
    
    // state for our modal.
    const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
        return localStorage.getItem('emmaEngineWelcomeDismissed') !== 'true';
    });
    
    // State for our new checkbox (defaulted to true to save them a click)
    const [dontShowAgain, setDontShowAgain] = useState(true);

    // The handler to banish the modal and save the preference
    const handleDismissWelcome = () => {
        if (dontShowAgain) {
            localStorage.setItem('emmaEngineWelcomeDismissed', 'true');
        }
        setShowWelcomeModal(false);
    };

    const [recipeImage, setRecipeImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [followUpText, setFollowUpText] = useState('');
    const [dietaryPrefs, setDietaryPrefs] = useState({
        oilFree: true,
        glutenFree: false,
        sugarFree: true 
    })

    // 3-way state -> 'full', 'draft', or 'chat'
    const [engineMode, setEngineMode] = useState('chat');

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

    const processChatTurn = async (newUserMessageText, prefs) => {
        
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
        setDietaryPrefs(prefs);

        const updatedHistory = [
            ...chatHistory, 
            { role: 'user', parts: [{ text: newUserMessageText }] }
        ];

        try {
            const isChatActive = engineMode === 'chat';
            const systemInstructions = getSystemInstructions(prefs, currentUserName, isChatActive);
            
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

    const handleInitialGenerate = (userRequest, formPrefs) => {
        setChatHistory([]);
        setRecipeImage(null); 
        
        const formattedRequest = engineMode === 'chat' 
            ? userRequest 
            : `I want a recipe for: ${userRequest}`;
            
        processChatTurn(formattedRequest, formPrefs);
    };

    const handleFollowUpSubmit = (e) => {
        e.preventDefault();
        if (!followUpText.trim()) return;
        
        const messageToSend = followUpText;
        setFollowUpText(''); 
        processChatTurn(messageToSend, dietaryPrefs);
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
            {/* Welcome Modal */}
            {showWelcomeModal && (
                <div className="welcome-modal-overlay">
                    <div className="welcome-modal-content">
                        <h3>Welcome to the Engine Room, {currentUserName}! 👩‍🍳</h3>
                        <p>Right then, let’s get one thing straight: I am not just a glorified recipe dispenser; I am your new culinary confidante.</p>
                        <p><strong>Nutrition Natter & Draft modes</strong> are absolutely free of charge. </p>
                        <p>However, if you fancy something truly spectacular, switch over to <strong>Masterpiece Mode</strong>. That will cost you a shiny token, but it forces me to do all the tedious macro-math and paint you a gorgeous picture of the dish.</p>
                        
                        <div className="modal-preferences">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                />
                                Don't show this bloody message again
                            </label>
                        </div>

                        <button 
                            className="dismiss-modal-btn" 
                            onClick={handleDismissWelcome}
                        >
                            Right, let's get cooking!
                        </button>
                    </div>
                </div>
            )}

            <header className="dashboard-header">
                <h2>Emma's Culinary & Chat Engine</h2>
                <p>Always Plant-Based. AI Enhanced. Proper Advice.</p>
            </header>

            {chatHistory.length === 0 && (
                <>
                    <div className="mode-selector-container">
                        <label className={`mode-label ${engineMode === 'full' ? 'active' : ''}`}>
                            <input type="radio" name="engineMode" value="full" checked={engineMode === 'full'} onChange={(e) => setEngineMode(e.target.value)} />
                            📸 Create Masterpiece (1 Token)
                        </label>
                        <label className={`mode-label ${engineMode === 'draft' ? 'active' : ''}`}>
                            <input type="radio" name="engineMode" value="draft" checked={engineMode === 'draft'} onChange={(e) => setEngineMode(e.target.value)} />
                            📝 Create Recipe (Free)
                        </label>
                        <label className={`mode-label ${engineMode === 'chat' ? 'active' : ''}`}>
                            <input type="radio" name="engineMode" value="chat" checked={engineMode === 'chat'} onChange={(e) => setEngineMode(e.target.value)} />
                            💬 Chat /w Emma (Free)
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

            {/* Top 'New Chat' Button */}
            {chatHistory.length > 0 && (
                <div className="action-row top-action">
                    <button 
                        onClick={handleResetEngine}
                        disabled={isLoading}
                        className="new-chat-btn"
                    >
                        New Chat
                    </button>
                </div>
            )}

            <div className="chat-container">
                {chatHistory.map((msg, index) => {
                    if (msg.role === 'user') {
                        return (
                            <div key={index} className="user-message">
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
                                isChat={engineMode === 'chat'}
                            />
                        )
                    }
                })}
            </div>

            {/* Follow-up Chat Input */}
            {chatHistory.length > 0 && (
                <form onSubmit={handleFollowUpSubmit} className="follow-up-form">
                    <input 
                        type="text" 
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                        placeholder={(isBroke && engineMode === 'full') 
                            ? "Out of tokens, love!" 
                            : "E.g., Let's natter about plant protein, or draft a spicy stew..."}
                        disabled={isLoading || (isBroke && engineMode === 'full')}
                        className={`follow-up-input ${(isBroke && engineMode === 'full') ? 'broke-input' : ''}`}
                    />
                    <button 
                        type="submit" 
                        className={`submit-btn follow-up-submit ${(isBroke && engineMode === 'full') ? 'broke-btn' : ''}`}
                        disabled={isLoading || !followUpText.trim() || (isBroke && engineMode === 'full')}
                    >
                        {isLoading ? "Thinking..." : ((isBroke && engineMode === 'full') ? "🪙 Skint" : "Send")}
                    </button>
                </form>
            )}
            
            {/* Bottom 'Bin It' / 'New Chat' Button */}
            {chatHistory.length > 0 && !isLoading && showBottomBin && (
                <div className="action-row bottom-action">
                    <button 
                        onClick={handleResetEngine}
                        disabled={isLoading}
                        className="new-chat-btn"
                    >
                        New Chat
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmmasRecipeEngine;