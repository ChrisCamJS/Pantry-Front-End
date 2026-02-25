import React from 'react';
import Header from './Header';
/**
 * Layout Component
 * Acts as the master wrapper for the entire application.
 * It ensures that every page has consistent padding, headers, and footers.
 */

const Layout = ({children}) => {
    return (
        <div className='app-container'>
            <Header />
            <main className='main-content'>
                {children}
            </main>

            <footer>
                <p>
                    &copy; {new Date().getFullYear()} The Veggie Vault 2026. All rights reserved.
                </p>
            </footer>
            

         </div>
    );
}

export default Layout;