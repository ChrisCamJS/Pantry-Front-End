// src/pages/EditRecipe.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styles from './AdminDashboard.module.css'; // <-- Reusing admin CSS!

const EditRecipe = () => {
    const { id } = useParams(); // Grabs the ID straight out of the URL
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [recipeForm, setRecipeForm] = useState({
        title: '', description: '', yields: '', prepTime: '', cookTime: '', 
        ingredients: '', instructions: '', nutritionInfo: '', notes: '', imageUrl: ''
    });

    // Fetch the recipe the moment the component loads
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await api.getRecipesById(id);
                
                // The DB returns raw snake_case column names, so we map them to our camelCase state!
                setRecipeForm({
                    title: data.title || '',
                    description: data.description || '',
                    yields: data.yields || '',
                    prepTime: data.prep_time || '',
                    cookTime: data.cook_time || '',
                    // Untangle the arrays back into newline-separated strings
                    ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : '',
                    instructions: Array.isArray(data.instructions) ? data.instructions.join('\n') : '',
                    nutritionInfo: Array.isArray(data.nutrition_info) ? data.nutrition_info.join('\n') : '',
                    notes: data.notes || '',
                    imageUrl: data.image_url || ''
                });
            } catch (err) {
                console.error("Failed to fetch recipe for editing:", err);
                alert("Couldn't find that recipe in the Vault.");
                navigate('/admin');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    // Handle standard text inputs
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setRecipeForm(prev => ({ ...prev, [name]: value }));
    };

    // Re-using our brilliant image upload logic
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        try {
            const response = await api.uploadImages(formData);
            if (response.success) {
                const newUrls = response.urls.join(',');
                setRecipeForm(prev => ({
                    ...prev,
                    imageUrl: prev.imageUrl ? `${prev.imageUrl},${newUrls}` : newUrls
                }));
                alert('Images uploaded! Hit save to lock them in.');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload images.');
        }
    };

    // Submit the edits
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        // Repackage the strings back into arrays for the PHP backend
        const formattedData = {
            ...recipeForm,
            ingredients: recipeForm.ingredients.split('\n').filter(line => line.trim() !== ''),
            instructions: recipeForm.instructions.split('\n').filter(line => line.trim() !== ''),
            nutritionInfo: recipeForm.nutritionInfo.split('\n').filter(line => line.trim() !== ''),
        };

        try {
            const response = await api.updateRecipe(id, formattedData);
            if (response.success) {
                alert('Recipe successfully updated!');
                navigate('/admin'); // Boot them back to the dashboard
            }
        } catch (err) {
            console.error("Failed to update recipe:", err);
            alert("The Vault rejected your edits. Check the console.");
        }
    };

    if (isLoading) {
        return <div className={styles.adminContainer}><h2 style={{textAlign: 'center', marginTop: '50px'}}>Fetching Masterpiece...</h2></div>;
    }

    return (
        <div className={styles.adminContainer}>
            <header className={styles.adminHeader}>
                <h2>Edit Vault Entry #{id}</h2>
                <button 
                    onClick={() => navigate('/admin')} 
                    className={styles.deleteBtn} 
                    style={{backgroundColor: '#6b7280'}}
                >
                    Cancel & Return
                </button>
            </header>

            <main className={styles.adminContentArea}>
                <section className={styles.addRecipeSection}>
                    <form onSubmit={handleUpdateSubmit} className={styles.adminForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Recipe Title</label>
                                <input type="text" name="title" value={recipeForm.title} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Yields</label>
                                <input type="text" name="yields" value={recipeForm.yields} onChange={handleFormChange} placeholder="e.g. 4 servings" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea name="description" rows="2" value={recipeForm.description} onChange={handleFormChange} required />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Prep Time (mins)</label>
                                <input type="number" name="prepTime" value={recipeForm.prepTime} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Cook Time (mins)</label>
                                <input type="number" name="cookTime" value={recipeForm.cookTime} onChange={handleFormChange} required />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Ingredients (One per line)</label>
                                <textarea name="ingredients" rows="6" value={recipeForm.ingredients} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Instructions (One per line)</label>
                                <textarea name="instructions" rows="6" value={recipeForm.instructions} onChange={handleFormChange} required />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Macros & Micros</label>
                                <textarea name="nutritionInfo" rows="6" value={recipeForm.nutritionInfo} onChange={handleFormChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Oil-Free Rationale / Notes</label>
                                <textarea name="notes" rows="6" value={recipeForm.notes} onChange={handleFormChange} required />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Image URLs (Comma separated)</label>
                                <input type="text" name="imageUrl" value={recipeForm.imageUrl} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Upload Additional Images</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ padding: '10px 0' }} />
                            </div>
                        </div>

                        <button type="submit" className={styles.saveBtn}>Update Masterpiece</button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default EditRecipe;