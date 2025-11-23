# SAP Production Manager - Idle Game

A vintage SAP-themed idle/incremental game where you manage a production company. Start from mining ore and build up to complex production chains!

## 🎮 Current Features

### Phase 1 - Manual Production ✅
- **Company Setup**: Name your company and start from scratch
- **Manual Production**: Click to produce items through a production chain
- **Inventory Management**: Track all your materials and products
- **Selling System**: Sell items at any time for cash
- **Auto-Save**: Game automatically saves every 10 seconds
- **Vintage SAP UI**: Classic enterprise software aesthetic with sharp edges, SAP blue, and retro styling

### Phase 2 - Automation ✅
- **Machine Purchase System**: Buy machines to automate production
- **Progressive Unlocks**: Machines unlock as you reach cash milestones
- **Background Processing**: Game continues producing even while idle
- **Multiple Machines**: Purchase multiple of the same machine type
- **Machine Status**: Real-time progress bars and status indicators
- **True Idle Gameplay**: Transition from manual clicking to automated factory

### Phase 3 & 4 - Extended Content & Upgrades ✅
**13 Items Across 6 Tiers:**
- Tier 1: Iron Ore
- Tier 2: Iron Ingot
- Tier 3: Screw, Metal Plate, Wire
- Tier 4: Bracket, Hinge, Spring
- Tier 5: Door, Cabinet, Toolbox
- Tier 6: Machinery, Vehicle Frame

**14 Complex Recipes:**
- Multiple input requirements (e.g., Cabinet needs Plate, Door, Bracket, Screws)
- Unlockable through research upgrades

**11 Upgrades:**
- Sell Quantity: Sell 1 → 10 → 100 → 1000 at once
- Market Research: +10% selling price (10 levels)
- Price Floors: Prevent prices dropping below 80-90% base
- Production Speed: +10% faster manual production (20 levels)
- Automation Speed: +15% faster machines (15 levels)
- Research: Unlock new recipe tiers progressively

**Dynamic Market System:**
- Live pricing with ±15% fluctuation every 30 seconds
- Supply/demand: Selling lowers prices temporarily
- Price history and trend indicators
- Demand levels and recovery mechanics

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

### Early Game (Manual Phase)
1. **Start**: Enter your company name
2. **Mine**: Click "Mine" to extract iron ore (sells for $1)
3. **Smelt**: Click "Smelt" to turn ore into ingots (sells for $3)
4. **Craft**: Click "Craft" to turn ingots into screws (sells for $5)
5. **Sell**: Use "Sell All" buttons to convert inventory to cash
6. **Save Up**: Accumulate $100 for your first machine!

### Mid Game (First Automation)
7. **Buy Ore Extractor**: Purchase your first machine for $100
8. **Passive Income**: Watch ore automatically accumulate
9. **Unlock More**: Auto-Smelter unlocks at $100, Screw Machine at $250
10. **Scale Up**: Buy multiple machines to increase production
11. **Strategy**: Balance manual production with automation purchases

## 📈 Progression Path

### Completed
- **Phase 1** ✅: Manual clicking, basic production chain, selling
- **Phase 2** ✅: Machine automation, progressive unlocks, idle gameplay
- **Phase 3 & 4** ✅: Extended production chains (13 items), upgrades, market simulation

### Coming Soon (Future Phases)
- **Prestige System**: Reset for permanent bonuses
- **Workers**: Hire employees for production multipliers
- **Multiple Factories**: Expand to different locations
- **Contracts**: Fulfill orders for bonus rewards

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable SAP-themed components
│   └── screens/      # Game screens (Setup, Production)
├── data/             # Game data (items, recipes)
├── types/            # TypeScript type definitions
├── utils/            # Utilities (save system)
└── styles/           # SAP theme CSS
```

## 🎨 Tech Stack

- **Framework**: Preact (lightweight React alternative)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Pure CSS (vintage SAP theme)
- **State**: Preact hooks
- **Storage**: localStorage

## 💾 Save System

- Auto-saves every 10 seconds
- Saves on browser close
- Data stored in browser localStorage
- To reset: Clear browser data for this site

## 🎯 Design Philosophy

- **Start Simple**: Begin with the absolute basics (mining ore)
- **Strategic Choices**: Sell now vs. invest in production
- **Satisfying Feedback**: Watch numbers grow and progress bars fill
- **Vintage Aesthetic**: Embrace classic SAP enterprise software look
- **Modular Design**: Easy to expand with new items, recipes, and features

## 📝 License

This is a personal project. Feel free to use and modify as you wish!

## 🔗 Resources

- Design Document: [DESIGN.md](./DESIGN.md)
- Current Phase: **Phase 3 & 4 (Content + Upgrades)** ✅
- Next: Future enhancements (Prestige, Workers, etc.)
