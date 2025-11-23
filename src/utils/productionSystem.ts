import { GameState, MachineInstance } from '../types/game.types';
import { MACHINES } from '../data/machines';
import { RECIPES } from '../data/recipes';

export function processMachineProduction(
  gameState: GameState,
  _deltaTime: number
): GameState {
  const newState = { ...gameState };
  const updatedMachines: MachineInstance[] = [];

  for (const machine of newState.machines) {
    if (!machine.active) {
      updatedMachines.push(machine);
      continue;
    }

    const machineData = MACHINES[machine.machineId];
    const recipe = RECIPES[machineData.recipeId];

    // Calculate progress
    const timeSinceUpdate = Date.now() - machine.lastUpdate;
    const progressIncrease = (timeSinceUpdate / machineData.productionTime) * 100;
    const newProgress = machine.progress + progressIncrease;

    if (newProgress >= 100) {
      // Production complete!
      const completedCycles = Math.floor(newProgress / 100);

      for (let i = 0; i < completedCycles; i++) {
        // Check if we have enough input materials
        if (recipe.input) {
          const currentAmount = newState.inventory[recipe.input.itemId] || 0;
          if (currentAmount >= recipe.input.amount) {
            // Consume input
            newState.inventory[recipe.input.itemId] -= recipe.input.amount;
            // Add output
            newState.inventory[recipe.output.itemId] =
              (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;
          } else {
            // Not enough materials, machine becomes idle
            break;
          }
        } else {
          // No input required, just produce
          newState.inventory[recipe.output.itemId] =
            (newState.inventory[recipe.output.itemId] || 0) + recipe.output.amount;
        }
      }

      // Update machine with remaining progress
      updatedMachines.push({
        ...machine,
        progress: newProgress % 100,
        lastUpdate: Date.now(),
      });
    } else {
      // Still in progress
      updatedMachines.push({
        ...machine,
        progress: newProgress,
        lastUpdate: Date.now(),
      });
    }
  }

  newState.machines = updatedMachines;
  return newState;
}

export function checkAndUnlockMachines(gameState: GameState): GameState {
  const newState = { ...gameState };
  const newUnlocks: string[] = [];

  for (const machineId of Object.keys(MACHINES)) {
    if (newState.unlockedMachines.includes(machineId)) {
      continue; // Already unlocked
    }

    const machine = MACHINES[machineId];
    let shouldUnlock = false;

    if (machine.unlockRequirement.type === 'cash') {
      shouldUnlock = newState.company.cash >= machine.unlockRequirement.value;
    } else if (machine.unlockRequirement.type === 'item' && machine.unlockRequirement.itemId) {
      const itemAmount = newState.inventory[machine.unlockRequirement.itemId] || 0;
      shouldUnlock = itemAmount >= machine.unlockRequirement.value;
    }

    if (shouldUnlock) {
      newUnlocks.push(machineId);
    }
  }

  if (newUnlocks.length > 0) {
    newState.unlockedMachines = [...newState.unlockedMachines, ...newUnlocks];
  }

  return newState;
}

export function purchaseMachine(gameState: GameState, machineId: string): GameState | null {
  const machine = MACHINES[machineId];
  if (!machine) return null;

  // Check if unlocked
  if (!gameState.unlockedMachines.includes(machineId)) {
    return null;
  }

  // Check if enough cash
  if (gameState.company.cash < machine.cost) {
    return null;
  }

  const newState = { ...gameState };

  // Deduct cost
  newState.company.cash -= machine.cost;

  // Add machine instance
  const newMachine: MachineInstance = {
    id: `${machineId}_${Date.now()}`,
    machineId: machineId,
    progress: 0,
    lastUpdate: Date.now(),
    active: true,
  };

  newState.machines = [...newState.machines, newMachine];

  return newState;
}
