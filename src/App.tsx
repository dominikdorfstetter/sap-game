import { useEffect, useState } from 'preact/hooks';
import { GameState, GameScreen, CompanyType } from './types/game.types';
import { loadGame, saveGame, createNewGame } from './utils/saveSystem';
import { processMachineProduction, checkAndUnlockMachines } from './utils/productionSystem';
import { updateMarketPrices, recoverDemand } from './utils/marketSystem';
import { processStaffProduction, paySalaries, processResearch } from './utils/staffSystem';
import { processQuarterEnd, updateProductivity } from './utils/fiscalSystem';
import { SetupScreen } from './components/screens/SetupScreen';
import { ProductionScreen } from './components/screens/ProductionScreen';
import './styles/erpTheme.css';

export function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('setup');

  // Load game on mount
  useEffect(() => {
    const savedGame = loadGame();
    if (savedGame) {
      setGameState(savedGame);
      setCurrentScreen('production');
    }
  }, []);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      saveGame(gameState);
    }, 10000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Game tick - process automated production
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      setGameState((currentState) => {
        if (!currentState) return currentState;

        // Process machine production
        let newState = processMachineProduction(currentState, 500);

        // Process staff production
        newState = processStaffProduction(newState, 500);

        // Process research
        newState = processResearch(newState, 500);

        // Pay salaries (checks interval internally)
        newState = paySalaries(newState);

        // Check for new unlocks
        newState = checkAndUnlockMachines(newState);

        // Update market prices (checks interval internally)
        newState = updateMarketPrices(newState);

        // Recover demand gradually
        newState = recoverDemand(newState);

        // Update productivity rating
        newState = updateProductivity(newState);

        // Process quarter end (checks interval internally)
        newState = processQuarterEnd(newState);

        return newState;
      });
    }, 500); // Tick every 500ms

    return () => clearInterval(interval);
  }, [gameState?.machines.length]); // Re-run when number of machines changes

  // Save on unmount
  useEffect(() => {
    return () => {
      if (gameState) {
        saveGame(gameState);
      }
    };
  }, [gameState]);

  const handleStartGame = (companyName: string, companyType: CompanyType) => {
    const newGame = createNewGame(companyName, companyType);
    setGameState(newGame);
    setCurrentScreen('production');
    saveGame(newGame);
  };

  const handleUpdateState = (newState: GameState) => {
    setGameState(newState);
    // Save immediately on state changes
    saveGame(newState);
  };

  if (currentScreen === 'setup') {
    return <SetupScreen onComplete={handleStartGame} />;
  }

  if (currentScreen === 'production' && gameState) {
    return <ProductionScreen gameState={gameState} onUpdateState={handleUpdateState} />;
  }

  return <div>Loading...</div>;
}
