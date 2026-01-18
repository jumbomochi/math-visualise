# CLAUDE.md

## Project Overview

This is an **H2 Mathematics Teaching Aid** designed to help students visualize and understand mathematical concepts according to the **Singapore SEAB 9758 syllabus standards**.

## Tech Stack

### Core Framework
- **Vite** - Build tool and development server
- **React** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library

### Visualization Libraries
- **P5.js** - For 2D visualizations
  - Used for topics like Combinatorics (Slot Method)
  - Interactive diagrams and animations
  - Graph plotting and transformations

- **Three.js** - For 3D visualizations
  - Used for 3D Vectors
  - Spatial geometry representations
  - Interactive 3D manipulations

## Syllabus Requirements

All mathematical content, notation, and methodology **must strictly follow the Singapore SEAB 9758 H2 Mathematics syllabus**.

### Key Syllabus Topics to Support
1. **Pure Mathematics**
   - Functions and Graphs
   - Sequences and Series
   - Vectors (2D and 3D)
   - Complex Numbers
   - Calculus (Differentiation and Integration)

2. **Statistics**
   - Probability
   - Permutations and Combinations
   - Probability Distributions
   - Sampling and Hypothesis Testing

## Visualization Guidelines

### 2D Visualizations (P5.js)
- Combinatorics visualization using the Slot Method
- Probability tree diagrams
- Function graphs and transformations
- Statistical distributions
- Sequence and series patterns

### 3D Visualizations (Three.js)
- Vector operations in 3D space
- Vector addition, subtraction, scalar multiplication
- Dot product and cross product visualization
- Lines and planes in 3D
- Angle between vectors

## Code Standards

### Component Structure
- Use functional components with React hooks
- Keep visualization logic separate from UI logic
- Make components reusable across different topics

### Styling
- Use Tailwind CSS for layout and basic styling
- Use Framer Motion for smooth transitions and animations
- Maintain consistent design language across visualizations

### Mathematical Accuracy
- All formulas must use standard H2 Math notation
- Verify calculations against syllabus examples
- Include proper mathematical symbols and formatting
- Provide step-by-step explanations where appropriate

## Development Notes

### P5.js Integration
- Use `react-p5` or P5 instance mode to avoid global conflicts
- Encapsulate P5 sketches in React components
- Handle cleanup properly on component unmount

### Three.js Integration
- Use `@react-three/fiber` and `@react-three/drei` for React integration
- Implement proper camera controls for 3D exploration
- Optimize performance for smooth interactions

### Accessibility
- Ensure visualizations have text alternatives
- Provide keyboard navigation where applicable
- Use sufficient color contrast
- Include mathematical descriptions for screen readers

## File Organization
```
src/
├── components/
│   ├── visualizations/
│   │   ├── 2d/          # P5.js components
│   │   └── 3d/          # Three.js components
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
├── lib/
│   ├── math/            # Mathematical utilities
│   └── helpers/         # Helper functions
├── data/
│   └── syllabus/        # Syllabus-specific content
└── pages/               # Main application pages
```

## References
- [SEAB H2 Mathematics (9758) Syllabus](https://www.seab.gov.sg/docs/default-source/national-examinations/syllabus/alevel/2024syllabus/9758_y24_sy.pdf)
- [P5.js Documentation](https://p5js.org/reference/)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
