import { useState } from 'preact/hooks';
import { GameState } from '../../types/game.types';
import { RECIPES } from '../../data/recipes';
import { ITEMS } from '../../data/items';
import { Button } from '../ui/Button';
import { ClickInput } from '../inputs/ClickInput';
import { SliderInput } from '../inputs/SliderInput';
import { RapidClickInput } from '../inputs/RapidClickInput';
import { HoldReleaseInput } from '../inputs/HoldReleaseInput';

interface QuickProductionProps {
  gameState: GameState;
  onProductionComplete: (recipeId: string) => void;
}

export function QuickProduction({ gameState, onProductionComplete }: QuickProductionProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const unlockedRecipes = Object.values(RECIPES).filter(
    (recipe) => gameState.unlockedRecipes.includes(recipe.id) || recipe.unlocked
  );

  const canProduce = (recipeId: string) => {
    const recipe = RECIPES[recipeId];
    for (const input of recipe.inputs) {
      const currentAmount = gameState.inventory[input.itemId] || 0;
      if (currentAmount < input.amount) return false;
    }
    return true;
  };

  const getRecipeInputsDisplay = (recipeId: string): string => {
    const recipe = RECIPES[recipeId];
    if (recipe.inputs.length === 0) return 'No inputs needed';

    return recipe.inputs
      .map((input) => `${input.amount}x ${ITEMS[input.itemId].name}`)
      .join(', ');
  };

  const handleProductionComplete = () => {
    if (selectedRecipe) {
      onProductionComplete(selectedRecipe);
      setSelectedRecipe(null);
    }
  };

  const renderProductionInput = (recipe: typeof RECIPES[string]) => {
    const inputMethod = recipe.inputMethod || 'click';
    const canStart = canProduce(recipe.id);

    switch (inputMethod) {
      case 'click':
        return <ClickInput onComplete={handleProductionComplete} disabled={!canStart} actionLabel={recipe.name} />;
      case 'slider':
        return <SliderInput onComplete={handleProductionComplete} disabled={!canStart} actionLabel={recipe.name} />;
      case 'rapid-click':
        return <RapidClickInput onComplete={handleProductionComplete} disabled={!canStart} actionLabel={recipe.name} requiredClicks={5} />;
      case 'hold-release':
        return <HoldReleaseInput onComplete={handleProductionComplete} disabled={!canStart} actionLabel={recipe.name} />;
      default:
        return <ClickInput onComplete={handleProductionComplete} disabled={!canStart} actionLabel={recipe.name} />;
    }
  };

  // Show first 3 recipes by default, or all if showAll is true
  const displayedRecipes = showAll ? unlockedRecipes : unlockedRecipes.slice(0, 3);

  if (selectedRecipe) {
    const recipe = RECIPES[selectedRecipe];
    return (
      <div data-tutorial-id="production-widget">
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 4px 0', color: '#003366' }}>{recipe.name}</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            {getRecipeInputsDisplay(selectedRecipe) !== 'No inputs needed' && (
              <span>Needs: {getRecipeInputsDisplay(selectedRecipe)} → </span>
            )}
            Produces: {recipe.output.amount}x {ITEMS[recipe.output.itemId].name}
          </p>
        </div>

        {renderProductionInput(recipe)}

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <Button onClick={() => setSelectedRecipe(null)} style={{ fontSize: '12px', padding: '6px 12px' }}>
            ← Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-tutorial-id="production-widget">
      <div style={{ marginBottom: '12px' }}>
        <table className="erp-table">
          <thead>
            <tr>
              <th>Recipe</th>
              <th>Output</th>
              <th style={{ width: '80px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecipes.map((recipe) => {
              const canCraft = canProduce(recipe.id);
              return (
                <tr key={recipe.id}>
                  <td style={{ fontSize: '13px' }}>{recipe.name}</td>
                  <td style={{ fontSize: '12px' }}>
                    {recipe.output.amount}x {ITEMS[recipe.output.itemId].name}
                  </td>
                  <td>
                    <Button
                      onClick={() => setSelectedRecipe(recipe.id)}
                      disabled={!canCraft}
                      primary
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      Craft
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {unlockedRecipes.length > 3 && (
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => setShowAll(!showAll)} style={{ fontSize: '12px', padding: '6px 12px' }}>
            {showAll ? 'Show Less' : `Show All (${unlockedRecipes.length} recipes)`}
          </Button>
        </div>
      )}

      {unlockedRecipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px', color: '#666' }}>
          <p>No recipes unlocked yet. Complete research to unlock more!</p>
        </div>
      )}
    </div>
  );
}
