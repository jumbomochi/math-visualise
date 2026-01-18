# H2 Mathematics Visualizer

An interactive teaching aid for the **Singapore H2 Mathematics (SEAB 9758)** syllabus, featuring plug-and-play visualization modules built with React, P5.js, and Three.js.

## 🎯 Features

- **6 Main Syllabus Strands**: Complete coverage of H2 Math topics
- **Plug-and-Play Architecture**: Add new visualizations without touching core code
- **State Preservation**: Switch between topics without losing progress
- **Pure Math Functions**: UI-independent calculations following syllabus standards
- **Interactive Visualizations**: P5.js for 2D, Three.js for 3D graphics
- **Step-by-Step Explanations**: Detailed breakdowns with LaTeX formulas

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## 📚 Tech Stack

### Core Framework
- **Vite** - Lightning-fast build tool
- **React 18** - UI framework with TypeScript
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### Visualization Libraries
- **P5.js** - 2D visualizations (Combinatorics, Probability, Graphs)
- **Three.js** - 3D visualizations (Vectors, Complex Numbers)
- **@react-three/fiber** - React integration for Three.js

### State Management
- **Zustand** - Lightweight state management with state preservation

### Math Rendering
- **KaTeX** - Fast LaTeX math rendering

## 🏗️ Architecture Highlights

### Plug-and-Play System

Add new modules without modifying core code:

```typescript
// 1. Define module
const myModule: VisualizationModule = {
  id: 'topic.visualization',
  Component: MyComponent,
  getInitialState: () => ({ /* MathState */ }),
  // ... other fields
};

// 2. Register
moduleRegistry.register(myModule);

// 3. Import in src/modules/index.ts
// Module automatically appears in navigation!
```

### Key Principles

1. **Logic Decoupling**: Pure math functions in `src/math/` (completely UI-independent)
2. **Standardized State**: All modules use `MathState` interface
3. **State Preservation**: Navigation store saves progress when switching topics
4. **Self-Registration**: Modules register themselves on import

## 📖 Syllabus Coverage

### 1. Functions & Graphs (Blue)
### 2. Calculus (Green)
### 3. Vectors (Purple)
### 4. Complex Numbers (Orange)
### 5. Probability (Red)
- ✅ **Slot Method for Permutations** (implemented)
### 6. Distributions (Teal)

## 🎓 Current Modules

### ✅ Slot Method for Permutations
**Location**: Probability → Permutations & Combinations → Slot Method

**Features**:
- Interactive P5.js visualization with slot boxes
- Adjust total items (n) and positions (r)
- Animated step-by-step filling
- Formula breakdown with LaTeX
- Pure math functions in `src/math/combinatorics/slotMethod.ts`

**Try it**:
1. Start the dev server
2. Navigate: Probability → Permutations & Combinations → Slot Method
3. Adjust sliders and watch the visualization update

## 🔧 Adding a New Module

See `CLAUDE.md` for detailed instructions.

Quick version:
1. Create pure math functions in `src/math/[topic]/`
2. Create module in `src/modules/[topic]/[Name]Visualization/`
3. Define module with `VisualizationModule` interface
4. Import in `src/modules/index.ts`

## 📁 Project Structure

```
src/
├── core/              # Architecture (types, registry, hooks)
├── math/              # Pure math functions (UI-independent)
├── modules/           # Visualization modules (plug-and-play)
├── components/        # UI components (layout, ui)
├── store/             # Zustand stores (navigation, progress)
├── data/              # Syllabus structure
└── App.tsx            # Main app
```

## 🚧 Roadmap

- [x] **Phase 1**: Foundation (architecture, types, stores)
- [x] **Phase 2**: First module (Slot Method with P5.js)
- [ ] **Phase 3**: More topics (distributions, 3D vectors)
- [ ] **Phase 4**: Enhancements (persistence, export, dark mode)

## 📚 References

- [SEAB H2 Mathematics Syllabus (9758)](https://www.seab.gov.sg/)
- [P5.js Documentation](https://p5js.org/reference/)
- [Three.js Documentation](https://threejs.org/docs/)

---

**Built for Singapore H2 Math students** 🇸🇬
