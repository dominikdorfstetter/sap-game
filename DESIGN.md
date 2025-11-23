# SAP Production Company - Idle Game Design Document

## Project Overview

An idle/incremental game that simulates running a production company, styled after classic SAP enterprise software. Players start with basic manual production (creating screws) and progressively build complex production chains, automate processes, and expand their company.

## Core Concept

Players manage a production company that:
- Starts with the simplest possible product (screws)
- Requires raw materials that must be transformed
- Builds increasingly complex products using previously produced items
- Allows selling at any production stage for profit
- Progresses from manual clicking to full automation
- Features research and upgrade systems
- Maintains an enterprise software aesthetic (oldschool SAP)

## Game Mechanics

### 1. Production System

#### Base Production Chain
```
Raw Material (Iron Ore)
    ↓ (Manual Processing → Automated Smelting)
Iron Ingot
    ↓ (Manual Shaping → Automated Machining)
Screw
    ↓ (Assembly)
Simple Components (Brackets, Hinges)
    ↓ (Assembly)
Complex Products (Doors, Cabinets)
    ↓ (Manufacturing)
Advanced Products (Machinery, Equipment)
```

#### Production Stages
1. **Manual Stage**: Click/drag to process materials
   - Each click produces one unit
   - Slow but free
   - Builds initial capital

2. **Semi-Automated**: Purchase basic machinery
   - Produces units over time
   - Requires occasional manual intervention
   - Cost-effective for scaling

3. **Fully Automated**: Advanced production lines
   - Continuous production
   - Requires maintenance (costs)
   - Highest throughput

### 2. Economic System

#### Selling vs. Keeping
- **Sell**: Convert inventory to cash immediately
  - Lower-tier items: Lower profit margins
  - Higher-tier items: Higher profit margins
  - Market prices fluctuate (simple algorithm)

- **Keep**: Use in production chain
  - Required for producing higher-value items
  - Strategic inventory management

#### Pricing Model
```javascript
Base prices (example):
- Iron Ore: $1
- Iron Ingot: $3
- Screw: $5
- Bracket: $15
- Hinge: $25
- Door: $200
- Cabinet: $500
- Machinery: $5,000
```

### 3. Progression System

#### Phase 1: Manual Labor (Starting Phase)
- Click to mine ore
- Click to smelt ingots
- Click to shape screws
- Sell screws for initial capital ($5 per screw)
- Goal: Save $100 to buy first automation

#### Phase 2: Basic Automation
- Purchase ore extractor ($100)
- Purchase auto-smelter ($250)
- Purchase screw machine ($500)
- Unlock assembly station ($1,000)
- Goal: Build production chain for brackets

#### Phase 3: Production Chains
- Unlock new product recipes
- Manage multiple production lines
- Balance inventory vs. sales
- Unlock research lab ($10,000)
- Goal: Optimize for maximum profit

#### Phase 4: Expansion
- Multiple factories
- Research advanced products
- Hire workers (productivity multipliers)
- Unlock prestige system
- Goal: Company valuation milestones

### 4. Research System

#### Research Categories
1. **Efficiency**: Reduce production time
2. **Automation**: Unlock new automated processes
3. **Products**: Unlock new items to produce
4. **Optimization**: Reduce material costs
5. **Expansion**: Unlock new facilities

#### Research Requirements
- Costs money
- Takes time (real-time or tick-based)
- May require prerequisite research
- Can be queued

### 5. Upgrade System

#### Machine Upgrades
- **Speed**: Faster production cycles
- **Capacity**: More units per batch
- **Efficiency**: Lower material consumption
- **Quality**: Higher sale prices

#### Company Upgrades
- Storage capacity
- Max workers
- Research speed
- Market access (better prices)

## Technical Architecture

### Technology Stack
- **Framework**: Preact
- **State Management**: Preact hooks + context (or Zustand for complex state)
- **Styling**: CSS Modules or styled-components (SAP theme)
- **Build Tool**: Vite
- **Storage**: localStorage for save games
- **TypeScript**: For type safety

### Project Structure
```
/src
  /components
    /ui
      - Button.tsx
      - Panel.tsx
      - Table.tsx
      - Modal.tsx
      - ProgressBar.tsx
    /game
      - ProductionLine.tsx
      - InventoryPanel.tsx
      - MarketPanel.tsx
      - ResearchPanel.tsx
      - UpgradePanel.tsx
    /layout
      - Header.tsx
      - Sidebar.tsx
      - MainContent.tsx
  /systems
    - ProductionSystem.ts
    - EconomySystem.ts
    - ResearchSystem.ts
    - UpgradeSystem.ts
    - SaveSystem.ts
  /data
    - items.ts
    - recipes.ts
    - research.ts
    - upgrades.ts
  /hooks
    - useGameLoop.ts
    - useProduction.ts
    - useInventory.ts
    - useMarket.ts
  /store
    - gameState.ts
  /styles
    - sapTheme.css
    - global.css
  /types
    - game.types.ts
  /utils
    - calculations.ts
    - formatters.ts
  - App.tsx
  - main.tsx
```

### Core Data Models

#### Game State
```typescript
interface GameState {
  company: Company;
  inventory: Inventory;
  production: ProductionState;
  research: ResearchState;
  market: MarketState;
  upgrades: UpgradeState;
  statistics: Statistics;
  lastTick: number;
}

interface Company {
  name: string;
  founded: number;
  cash: number;
  valuation: number;
  employees: number;
}

interface Inventory {
  [itemId: string]: number;
}

interface ProductionState {
  lines: ProductionLine[];
  manualActions: ManualAction[];
}

interface ProductionLine {
  id: string;
  recipeId: string;
  level: number;
  progress: number;
  active: boolean;
  inputBuffer: Inventory;
  outputBuffer: Inventory;
}

interface Recipe {
  id: string;
  name: string;
  inputs: { itemId: string; amount: number }[];
  outputs: { itemId: string; amount: number }[];
  productionTime: number; // milliseconds
  unlockedByDefault: boolean;
  unlockCost?: number;
  unlockResearch?: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  tier: number;
  icon: string;
}

interface Research {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  prerequisites: string[];
  effects: Effect[];
}

interface Effect {
  type: 'unlock_recipe' | 'speed_boost' | 'cost_reduction' | 'unlock_feature';
  target: string;
  value: number;
}
```

### Game Loop

The game operates on a tick-based system:

```typescript
// Main game loop (every 100ms)
function gameTick(deltaTime: number) {
  // 1. Update production lines
  updateProduction(deltaTime);

  // 2. Process research
  updateResearch(deltaTime);

  // 3. Update market prices (slow fluctuation)
  updateMarket(deltaTime);

  // 4. Calculate statistics
  updateStatistics();

  // 5. Auto-save (every 10 seconds)
  autoSave();
}
```

## UI/UX Design - SAP Classic Theme

### Visual Style
- **Color Scheme**:
  - Primary: #003366 (SAP Blue)
  - Secondary: #F0F0F0 (Light Gray)
  - Accent: #FFB600 (SAP Gold)
  - Background: #E5E5E5
  - Text: #000000
  - Borders: #999999

- **Typography**:
  - Font: "Segoe UI", "Arial", sans-serif
  - Monospace: "Courier New" for numbers
  - Headers: Bold, uppercase
  - Body: Regular, 14px

- **Layout**:
  - Fixed header with company name and stats
  - Left sidebar navigation
  - Main content area with panels
  - All elements in bordered panels/tables
  - No rounded corners (sharp edges)
  - Heavy use of tables and grids

### Screen Layouts

#### 1. Company Setup Screen
```
┌─────────────────────────────────────────┐
│  SAP Production Manager - Setup         │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Company Setup                   │   │
│  ├─────────────────────────────────┤   │
│  │ Company Name:                   │   │
│  │ [____________________]          │   │
│  │                                 │   │
│  │        [Start Company]          │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### 2. Main Game Screen
```
┌────────────────────────────────────────────────────────┐
│ SAP Production Manager | ACME Corp | Cash: $1,234.56  │
├────────────────────────────────────────────────────────┤
│ ┌──────┐ │                                             │
│ │Prod  │ │  ┌──────────────────────────────────────┐  │
│ │Inven │ │  │ Production Lines                     │  │
│ │Market│ │  ├──────────────────────────────────────┤  │
│ │R&D   │ │  │ Line 1: Screw Production   [▓░░] 33% │  │
│ │Stats │ │  │ Line 2: Bracket Assembly   [░░░]  0% │  │
│ └──────┘ │  └──────────────────────────────────────┘  │
│          │                                             │
│          │  ┌──────────────────────────────────────┐  │
│          │  │ Inventory                            │  │
│          │  ├──────────────────────────────────────┤  │
│          │  │ Iron Ore      | 156 | [Sell All]    │  │
│          │  │ Iron Ingot    |  89 | [Sell All]    │  │
│          │  │ Screw         |  42 | [Sell All]    │  │
│          │  └──────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Navigation Structure
1. **Production**: Main production view
2. **Inventory**: Stock management and selling
3. **Market**: Buy raw materials, sell products
4. **Research & Development**: Unlock technologies
5. **Upgrades**: Improve machinery and company
6. **Statistics**: Company performance metrics

## Implementation Phases

### Phase 1: Foundation (MVP)
**Goal**: Basic playable game loop

- [ ] Project setup (Vite + Preact + TypeScript)
- [ ] SAP-themed UI component library
- [ ] Company naming screen
- [ ] Basic game state management
- [ ] Manual production (click to produce)
- [ ] Simple inventory system (3 items: ore, ingot, screw)
- [ ] Basic selling mechanism
- [ ] Display cash and inventory
- [ ] localStorage save/load

**Deliverable**: Can name company, click to produce screws, sell for cash

### Phase 2: Automation
**Goal**: First automation milestone

- [ ] Production line system
- [ ] First automated machine (ore extractor)
- [ ] Timer-based production
- [ ] Purchase machinery UI
- [ ] Background processing (game ticks)
- [ ] Unlock system

**Deliverable**: Can buy first machine and automate ore collection

### Phase 3: Production Chains
**Goal**: Multi-step production

- [ ] Recipe system
- [ ] Multiple production lines
- [ ] Item dependencies
- [ ] Assembly stations
- [ ] 10+ items and recipes
- [ ] Material flow management

**Deliverable**: Can produce complex items from simple components

### Phase 4: Research & Upgrades
**Goal**: Progression depth

- [ ] Research system
- [ ] Research tree UI
- [ ] Machine upgrade system
- [ ] Efficiency improvements
- [ ] New recipe unlocks

**Deliverable**: Can research technologies and upgrade machines

### Phase 5: Advanced Features
**Goal**: Long-term engagement

- [ ] Market price fluctuations
- [ ] Multiple factories
- [ ] Workers/employees system
- [ ] Prestige system
- [ ] Statistics and achievements
- [ ] Export/import save games

**Deliverable**: Full-featured idle game

## Expandability & Modularity

### Plugin System Concept
```typescript
interface GameModule {
  id: string;
  name: string;
  onLoad: (gameState: GameState) => void;
  onTick?: (deltaTime: number, gameState: GameState) => void;
  components?: Record<string, ComponentType>;
  items?: Item[];
  recipes?: Recipe[];
  research?: Research[];
}

// Example: Energy module
const energyModule: GameModule = {
  id: 'energy',
  name: 'Energy Management',
  items: [
    { id: 'coal', name: 'Coal', ... },
    { id: 'electricity', name: 'Electricity', ... }
  ],
  recipes: [...],
  onTick: (dt, state) => {
    // Custom energy consumption logic
  }
};
```

### Expansion Ideas
1. **Energy System**: Machines require power
2. **Quality System**: Items have quality ratings
3. **Logistics**: Transportation between factories
4. **Market Complexity**: Supply/demand dynamics
5. **Contracts**: Fulfill orders for bonus rewards
6. **Competition**: AI competitor companies
7. **Random Events**: Market crashes, discoveries
8. **Multiplayer**: Trade with other players

## Key Design Principles

1. **Start Simple**: Player begins with absolute basics (mining ore by hand)
2. **Clear Progression**: Each milestone feels rewarding
3. **Strategic Choices**: Sell now vs. invest in production
4. **Idle-Friendly**: Can progress while away
5. **No Dead Ends**: All choices have value
6. **SAP Aesthetic**: Embrace the enterprise software look
7. **Modular Code**: Easy to add new items/recipes/features
8. **Performance**: Handle hundreds of production lines
9. **Fair Incremental**: No pay-to-win, just time investment
10. **Satisfying Feedback**: Numbers go up, progress bars fill

## Success Metrics

- Player can produce first screw within 30 seconds
- First automation purchase within 5 minutes
- First complex product within 15 minutes
- Multiple production chains within 1 hour
- Strong desire to return after closing game

## Technical Considerations

### Performance
- Efficient game loop (only update what's necessary)
- Virtual scrolling for large inventories
- Web Workers for heavy calculations (optional)
- Throttled rendering updates

### Save System
- Auto-save every 10 seconds
- Export/import for backup
- Save versioning for updates
- Offline progress calculation

### Balancing
- Exponential cost curves
- Linear-to-sublinear production gains
- Carefully tuned progression speed
- Playtest extensively

---

## Next Steps

1. Review and approve this design
2. Set up development environment
3. Build Phase 1 (MVP)
4. Iterate based on playtesting
5. Expand with additional phases

**Estimated MVP Development Time**: 2-3 implementation sessions
**Full Game (Phase 5)**: 8-10 implementation sessions
