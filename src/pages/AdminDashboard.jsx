import React, { useState } from 'react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('add'); // 'add' or 'manage'
    return (
        <div className='admin-container'>
            <header className='admin-header'>
                <h2>
                    Admin Vault Control
                </h2>
                <div className='admin-tabs'>
                    <button
                        className={activeTab === 'add' ? 'active' : ''}
                        onClick={() => setActiveTab('add')}
                    >
                        Add New Recipe
                    </button>
                    <button
                        className={activeTab === 'manage' ? 'active' : ''}
                        onClick={() => setActiveTab('manage')}
                    >
                        Manage Recipes
                    </button>
                </div>
            </header>

            <main className="admin-content-area">
                {activeTab === 'add' ? (
                <section className="add-recipe-section">
                    <h3>Secure Entry: New Recipe</h3>
                    <form className="admin-form">
                    <div className="form-group">
                        <label>Recipe Title</label>
                        <input type="text" placeholder="e.g. Iron-Rich Lentil Stew" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                        <label>Prep Time (mins)</label>
                        <input type="number" />
                        </div>
                        <div className="form-group">
                        <label>Cook Time (mins)</label>
                        <input type="number" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Oil-Free Rationale</label>
                        <textarea placeholder="Explain why this fits the vault's standards..."></textarea>
                    </div>

                    <div className="form-group">
                        <label>Macros (Protein / Carbs / Fat)</label>
                        <div className="macro-inputs">
                        <input type="text" placeholder="P" />
                        <input type="text" placeholder="C" />
                        <input type="text" placeholder="F" />
                        </div>
                    </div>

                    <button type="submit" className="save-btn">Vault This Recipe</button>
                    </form>
                </section>
                ) : (
                <section className="manage-recipes">
                    <p>[ Table of existing recipes will go here for Edit/Delete actions ]</p>
                </section>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;