# 3D Vector Operations Module Design

## Overview

Interactive Three.js visualization for 3D vector operations following the Singapore H2 Mathematics syllabus (SEAB 9758).

**Module ID:** `vectors.3d-operations`

## Scope

Core operations only:
- Vector addition
- Vector subtraction
- Scalar multiplication

## User Interface

### Layout
```
┌─────────────────────────────────────────────────────┐
│  [Addition] [Subtraction] [Scalar Multiply]  ← tabs │
├─────────────────────────────────────────────────────┤
│                                                     │
│              Three.js 3D Canvas                     │
│         (axes, grid, vector arrows)                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Vector A          │  Vector B / Scalar             │
│  x: ──●────  [2]   │  x: ────●──  [-1]             │
│  y: ────●──  [3]   │  y: ──●────  [2]              │
│  z: ──●────  [1]   │  z: ────●──  [4]              │
├─────────────────────────────────────────────────────┤
│  Formula: a + b = ⟨2,3,1⟩ + ⟨-1,2,4⟩ = ⟨1,5,5⟩     │
└─────────────────────────────────────────────────────┘
```

### Interactivity (Hybrid Approach)
- Component sliders for x, y, z (range: -5 to +5)
- Real-time updates to 3D scene
- No preset examples — free exploration

## 3D Scene Specifications

### Coordinate System
- Right-handed (H2 Math standard)
- X-axis: red, Y-axis: green, Z-axis: blue
- Grid on XZ plane with unit squares
- Axis range: -5 to +5

### Vector Rendering
- **Vector A:** Orange solid arrow
- **Vector B:** Cyan solid arrow
- **Result:** Yellow/gold arrow (thicker or dashed)
- All vectors originate from origin

### Camera
- OrbitControls (rotate/zoom/pan)
- Default isometric view
- Reset camera button

### Operation Visuals
- **Addition:** Parallelogram law — B drawn from tip of A
- **Subtraction:** Shows A and -B, result from origin
- **Scalar multiply:** A and kA overlaid

## Controls

### Tab Behavior
| Tab | Vector A | Vector B/Scalar | Result |
|-----|----------|-----------------|--------|
| Addition | 3 sliders (x,y,z) | 3 sliders (x,y,z) | **a** + **b** |
| Subtraction | 3 sliders (x,y,z) | 3 sliders (x,y,z) | **a** − **b** |
| Scalar Multiply | 3 sliders (x,y,z) | 1 slider (k: -3 to 3) | k**a** |

### Formula Display
Live KaTeX rendering showing full calculation.

## File Structure

```
src/modules/vectors/
├── index.ts
├── Vector3DOperations/
│   ├── index.ts
│   ├── Vector3DOperations.tsx
│   ├── Scene3D.tsx
│   ├── VectorArrow.tsx
│   ├── ControlPanel.tsx
│   └── types.ts

src/math/vectors/
├── operations.ts
└── types.ts
```

## Dependencies
- @react-three/fiber
- @react-three/drei
- Existing: Slider, Card, MathDisplay
