import { useEffect, useState } from 'preact/hooks';
import { GameState, GameScreen } from './types/game.types';
import { loadGame, saveGame, createNewGame } from './utils/saveSystem';
import { SetupScreen } from './components/screens/SetupScreen';
import { ProductionScreen } from './components/screens/ProductionScreen';
import './styles/sapTheme.css';

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

  // Save on unmount
  useEffect(() => {
    return () => {
      if (gameState) {
        saveGame(gameState);
      }
    };
  }, [gameState]);

  const handleStartGame = (companyName: string) => {
    const newGame = createNewGame(companyName);
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
