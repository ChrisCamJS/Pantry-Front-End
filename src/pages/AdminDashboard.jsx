// src/pages/AdminDashboard.jsx

import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboard Component
 * The restricted area for managing The Veggie Vault.
 * Includes forms for adding recipes and lists for moderation.
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <h2>Admin Vault Control</h2>
        <div className={styles.adminTabs}>
          <button 
            className={activeTab === 'add' ? styles.active : ''} 
            onClick={() => setActiveTab('add')}
          >
            Add New Recipe
          </button>
          <button 
            className={activeTab === 'manage' ? styles.active : ''} 
            onClick={() => setActiveTab('manage')}
          >
            Manage Recipes
          </button>
        </div>
      </header>

      <main className={styles.adminContentArea}>
        {activeTab === 'add' ? (
          <section className={styles.addRecipeSection}>
            <h3>Secure Entry: New Recipe</h3>
            <form className={styles.adminForm}>
              <div className={styles.formGroup}>
                <label>Recipe Title</label>
                <input type="text" placeholder="e.g. Iron-Rich Lentil Stew" />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prep Time (mins)</label>
                  <input type="number" />
                </div>
                <div className={styles.formGroup}>
                  <label>Cook Time (mins)</label>
                  <input type="number" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Oil-Free Rationale</label>
                <textarea placeholder="Explain why this fits the vault's standards..."></textarea>
              </div>

              <div className={styles.formGroup}>
                <label>Macros (Protein / Carbs / Fat)</label>
                <div className={styles.macroInputs}>
                  <input type="text" placeholder="P" />
                  <input type="text" placeholder="C" />
                  <input type="text" placeholder="F" />
                </div>
              </div>

              <button type="submit" className={styles.saveBtn}>Vault This Recipe</button>
            </form>
          </section>
        ) : (
          <section className={styles.manageRecipes}>
            <p>[ Table of existing recipes will go here for Edit/Delete actions ]</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;