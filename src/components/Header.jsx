import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Boot them back to the lobby
    };

    return (
        <header className="main-header">
            <div className="logo-container">
                <h1><Link to="/">The Veggie Vault</Link></h1>
            </div>

            <nav className="main-nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/wellness">Wellness Tools</Link></li>
                    
                    {/* The VIP Section */}
                    {user ? (
                        <>
                            {/* Check the actual database field for the premium tier */}
                            {user?.account_tier === 'premium' && (
                                <li><Link to="/engine">Emma's Recipe Engine</Link></li>
                            )}
                            
                            {/* Check the database field for admin status */}
                            {(user?.is_admin === 1 || user?.is_admin === '1' || user?.is_admin === true) && (
                                <li><Link to="/admin">Admin Vault</Link></li>
                            )}
                            
                            {/* The User Badge & Token Counter */}
                            <li className="user-status" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: '#48bb78' }}>
                                    Welcome, {user.username || 'Love'} 
                                    {user?.account_tier === 'premium' && <span title="Premium Member" style={{ marginLeft: '5px' }}>✨</span>}
                                </span>
                                
                                {/* The Token Stash - Only for Premium */}
                                {user?.account_tier === 'premium' && (
                                    <span 
                                        className="token-badge" 
                                        title="Emma Generation Tokens Remaining"
                                        style={{
                                            backgroundColor: '#ecc94b', 
                                            color: '#744210', 
                                            padding: '2px 8px', 
                                            borderRadius: '12px', 
                                            fontSize: '0.85em',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        🪙 {user.generation_tokens ?? 0}
                                    </span>
                                )}
                            </li>
                            
                            <li>
                                <button onClick={handleLogout} className="logout-btn" style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#e53e3e', fontWeight: 'bold' }}>
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;