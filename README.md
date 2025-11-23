# SAP Production Manager - Idle Game

A vintage SAP-themed idle/incremental game where you manage a production company. Start from mining ore and build up to complex production chains!

## 🎮 Current Features (Phase 1 MVP)

- **Company Setup**: Name your company and start from scratch
- **Manual Production**: Click to produce items through a production chain
  - Mine Iron Ore (1 second)
  - Smelt Iron Ingots (2 seconds, requires ore)
  - Craft Screws (3 seconds, requires ingots)
- **Inventory Management**: Track all your materials and products
- **Selling System**: Sell items at any time for cash
- **Auto-Save**: Game automatically saves every 10 seconds
- **Vintage SAP UI**: Classic enterprise software aesthetic with sharp edges, SAP blue, and retro styling

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

1. **Start**: Enter your company name
2. **Mine**: Click "Mine" to extract iron ore (sells for $1)
3. **Smelt**: Click "Smelt" to turn ore into ingots (sells for $3)
4. **Craft**: Click "Craft" to turn ingots into screws (sells for $5)
5. **Sell**: Use "Sell All" buttons to convert inventory to cash
6. **Strategy**: Decide whether to sell items for immediate profit or keep them for higher-tier production

## 📈 Progression Path

### Current (Phase 1)
- Manual clicking for all production
- Basic 3-item production chain
- Simple selling mechanics

### Coming Soon
- **Phase 2**: First automation - buy machines to auto-produce
- **Phase 3**: Extended production chains with 10+ items
- **Phase 4**: Research tree and upgrade systems
- **Phase 5**: Multiple factories, prestige system, workers

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
- Current Phase: **Phase 1 (MVP)** ✅
- Next Phase: **Phase 2 (Automation)**
