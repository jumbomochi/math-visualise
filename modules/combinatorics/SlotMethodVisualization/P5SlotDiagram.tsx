/**
 * P5 Slot Diagram
 *
 * P5.js visualization of the slot method for permutations
 */

import { FC, useEffect, useRef } from 'react';
import p5 from 'p5';
import { SlotCalculation } from '@/lib/math/combinatorics';

interface P5SlotDiagramProps {
  slots: SlotCalculation[];
  highlightedSlot?: number;
  animationStep?: number;
}

const P5SlotDiagram: FC<P5SlotDiagramProps> = ({
  slots,
  highlightedSlot = -1,
  animationStep = 0,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      const CANVAS_WIDTH = 800;
      const CANVAS_HEIGHT = 400;
      const SLOT_WIDTH = 100;
      const SLOT_HEIGHT = 100;
      const SLOT_SPACING = 20;

      p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.textFont('Inter, sans-serif');
      };

      p.draw = () => {
        p.background(250);

        if (slots.length === 0) {
          // Show empty state
          p.fill(100);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(16);
          p.text('Adjust the controls to see the slot method visualization', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
          return;
        }

        const totalWidth = slots.length * (SLOT_WIDTH + SLOT_SPACING) - SLOT_SPACING;
        const startX = (CANVAS_WIDTH - totalWidth) / 2;
        const centerY = CANVAS_HEIGHT / 2;

        // Draw slots
        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const x = startX + i * (SLOT_WIDTH + SLOT_SPACING);
          const y = centerY - SLOT_HEIGHT / 2;

          const isHighlighted = i === highlightedSlot;
          const isAnimated = i <= animationStep;

          // Slot box
          p.push();

          // Animation: fade in and slight scale
          if (isAnimated) {
            const progress = Math.min(1, (animationStep - i) * 0.5 + 0.5);
            p.translate(x + SLOT_WIDTH / 2, y + SLOT_HEIGHT / 2);
            p.scale(0.8 + 0.2 * progress);
            p.translate(-(x + SLOT_WIDTH / 2), -(y + SLOT_HEIGHT / 2));
          }

          // Box styling
          p.strokeWeight(3);
          if (isHighlighted) {
            p.stroke(37, 99, 235); // blue-600
            p.fill(219, 234, 254); // blue-100
          } else {
            p.stroke(147, 197, 253); // blue-300
            p.fill(239, 246, 255); // blue-50
          }

          p.rect(x, y, SLOT_WIDTH, SLOT_HEIGHT, 8);

          // Number of choices (large)
          p.fill(0);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(40);
          p.textStyle(p.BOLD);
          p.text(slot.availableChoices, x + SLOT_WIDTH / 2, y + SLOT_HEIGHT / 2);

          // Position label (top)
          p.textSize(14);
          p.textStyle(p.NORMAL);
          p.fill(75);
          p.text(`Position ${i + 1}`, x + SLOT_WIDTH / 2, y - 20);

          // Explanation (bottom)
          p.textSize(11);
          p.fill(100);
          const maxWidth = SLOT_WIDTH - 10;
          const words = slot.explanation.split(' ');
          let line = '';
          const lines = [];

          for (const word of words) {
            const testLine = line + word + ' ';
            if (p.textWidth(testLine) > maxWidth && line.length > 0) {
              lines.push(line);
              line = word + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          for (let j = 0; j < lines.length; j++) {
            p.text(
              lines[j].trim(),
              x + SLOT_WIDTH / 2,
              y + SLOT_HEIGHT + 15 + j * 14
            );
          }

          p.pop();

          // Multiplication symbol
          if (i < slots.length - 1) {
            p.fill(100);
            p.textSize(32);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('×', x + SLOT_WIDTH + SLOT_SPACING / 2, centerY);
          }
        }

        // Formula result
        if (animationStep >= slots.length - 1) {
          const resultY = centerY + SLOT_HEIGHT / 2 + 80;
          p.fill(0);
          p.textSize(18);
          p.textAlign(p.CENTER);
          p.textStyle(p.BOLD);
          p.text('Total Arrangements:', CANVAS_WIDTH / 2, resultY);

          const totalArrangements = slots.reduce((acc, slot) => acc * slot.availableChoices, 1);
          p.textSize(32);
          p.fill(37, 99, 235); // blue-600
          p.text(totalArrangements.toLocaleString(), CANVAS_WIDTH / 2, resultY + 35);
        }
      };
    };

    p5Instance.current = new p5(sketch, canvasRef.current);

    return () => {
      p5Instance.current?.remove();
      p5Instance.current = null;
    };
  }, [slots, highlightedSlot, animationStep]);

  return (
    <div ref={canvasRef} className="p5-canvas-container flex items-center justify-center" />
  );
};

export default P5SlotDiagram;
