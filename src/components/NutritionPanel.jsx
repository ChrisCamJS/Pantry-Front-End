import React, { useState } from 'react';
import './NutritionPanel.css';

const NutritionPanel = ({ nutrition }) => {
    // Our new state for the Progressive Disclosure toggle
    const [isExpanded, setIsExpanded] = useState(false);

    if (!nutrition || Object.keys(nutrition).length === 0) {
        return <p className="vault-error">Nutritional data is having a lie-in. Check back later.</p>;
    }

    const proteinGrams = nutrition.Protein ? parseFloat(nutrition.Protein) : 0;
    const fatGrams = nutrition.Fat ? parseFloat(nutrition.Fat) : 0;
    const carbGrams = nutrition.Carbohydrates ? parseFloat(nutrition.Carbohydrates) : 0;

    const proteinCals = Math.round(proteinGrams * 4);
    const fatCals = Math.round(fatGrams * 9);
    const carbCals = Math.round(carbGrams * 4);
    const totalCalculatedCals = proteinCals + fatCals + carbCals;

    const coreMacros = ['Calories', 'Protein', 'Fat', 'Carbohydrates'];
    const microKeys = Object.keys(nutrition).filter(key => !coreMacros.includes(key));

    const formattedMicros = microKeys.map(key => {
        const rawString = nutrition[key]; 
        let amount = rawString;
        let dv = "N/A"; 

        if (typeof rawString === 'string' && rawString.includes('(')) {
            const parts = rawString.split('(');
            amount = parts[0].trim(); 
            dv = parts[1].replace(')', '').trim(); 
        }
        return { name: key, amount, dv };
    });

    // Show all Micrso if expanded, otherwise just the first 5
    const displayedMicros = isExpanded ? formattedMicros : formattedMicros.slice(0, 5);

    return (
        <div className="nutrition-panel">
            <h3>Macro & Math Transparency</h3>
            
            <div className="macro-proofs">
                <p><strong>Protein:</strong> {proteinGrams}g <em>({proteinGrams}g × 4 kcal = {proteinCals} kcal)</em></p>
                <p><strong>Fat:</strong> {fatGrams}g <em>({fatGrams}g × 9 kcal = {fatCals} kcal)</em></p>
                <p><strong>Carbohydrates:</strong> {carbGrams}g <em>({carbGrams}g × 4 kcal = {carbCals} kcal)</em></p>
                <hr />
                <p><strong>Total Calculated Energy:</strong> {totalCalculatedCals} kcal</p>
                <p className="micro-note"><small><em>Note: Calculated calories may vary slightly from listed calories due to raw database rounding.</em></small></p>
            </div>

            <h4 className="micro-heading">Detailed Micronutrients</h4>
            <table className="micro-table">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Nutrient</th>
                        <th style={{ textAlign: 'left' }}>Amount</th>
                        <th style={{ textAlign: 'left' }}>Daily Value</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedMicros.map((micro, index) => (
                        <tr key={index}>
                            <td><strong>{micro.name}</strong></td>
                            <td>{micro.amount}</td>
                            <td>{micro.dv}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* The Toggle Button */}
            {formattedMicros.length > 5 && (
                <button 
                    className="toggle-micros-btn" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Collapse Data ⬆️' : `View All ${formattedMicros.length} Micros ⬇️`}
                </button>
            )}
        </div>
    );
};

export default NutritionPanel;