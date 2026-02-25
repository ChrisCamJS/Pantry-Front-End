import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="main-header">
            <div className="logo-container">
                <h1><Link to="/">The Veggie Vault</Link></h1>
            </div>

            <nav className="main-nav">
                <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/recipes">All Recipes</Link></li>
                <li><Link to="/remix-engine">Remix Engine</Link></li>
                <li><Link to="/admin">Admin Vault</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
