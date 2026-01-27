/**
 * Vector Operations
 *
 * Pure mathematical functions for 3D vector operations.
 * Following H2 Mathematics conventions.
 */

import { Vector2D, Vector3D, VectorOperationResult, Vector2DOperationResult } from './types';

/**
 * Add two vectors: a + b
 */
export function addVectors(a: Vector3D, b: Vector3D): VectorOperationResult {
  const result: Vector3D = {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };

  return {
    result,
    formula: `(${a.x}, ${a.y}, ${a.z}) + (${b.x}, ${b.y}, ${b.z}) = (${result.x}, ${result.y}, ${result.z})`,
    formulaLatex: `\\mathbf{a} + \\mathbf{b} = \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\\\ ${a.z} \\end{pmatrix} + \\begin{pmatrix} ${b.x} \\\\ ${b.y} \\\\ ${b.z} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\\\ ${result.z} \\end{pmatrix}`,
  };
}

/**
 * Subtract two vectors: a - b
 */
export function subtractVectors(a: Vector3D, b: Vector3D): VectorOperationResult {
  const result: Vector3D = {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  };

  return {
    result,
    formula: `(${a.x}, ${a.y}, ${a.z}) - (${b.x}, ${b.y}, ${b.z}) = (${result.x}, ${result.y}, ${result.z})`,
    formulaLatex: `\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\\\ ${a.z} \\end{pmatrix} - \\begin{pmatrix} ${b.x} \\\\ ${b.y} \\\\ ${b.z} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\\\ ${result.z} \\end{pmatrix}`,
  };
}

/**
 * Multiply vector by scalar: k * a
 */
export function scalarMultiply(k: number, a: Vector3D): VectorOperationResult {
  const result: Vector3D = {
    x: k * a.x,
    y: k * a.y,
    z: k * a.z,
  };

  return {
    result,
    formula: `${k} × (${a.x}, ${a.y}, ${a.z}) = (${result.x}, ${result.y}, ${result.z})`,
    formulaLatex: `${k}\\mathbf{a} = ${k} \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\\\ ${a.z} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\\\ ${result.z} \\end{pmatrix}`,
  };
}

/**
 * Calculate magnitude of a vector
 */
export function magnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Format a vector for display
 */
export function formatVector(v: Vector3D): string {
  return `(${v.x}, ${v.y}, ${v.z})`;
}

/**
 * Format a vector as LaTeX column notation
 */
export function formatVectorLatex(v: Vector3D, name?: string): string {
  const prefix = name ? `\\mathbf{${name}} = ` : '';
  return `${prefix}\\begin{pmatrix} ${v.x} \\\\ ${v.y} \\\\ ${v.z} \\end{pmatrix}`;
}

/**
 * Dot product of two vectors: a · b
 * Returns scalar value
 */
export function dotProduct(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Cross product of two vectors: a × b
 * Returns vector perpendicular to both a and b
 */
export function crossProduct(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

/**
 * Angle between two vectors in radians
 */
export function angleBetween(a: Vector3D, b: Vector3D): number {
  const magA = magnitude(a);
  const magB = magnitude(b);

  if (magA === 0 || magB === 0) return 0;

  const cosTheta = dotProduct(a, b) / (magA * magB);
  // Clamp to handle floating point errors
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

/**
 * Project vector a onto vector b
 * Returns the projection vector
 */
export function projectOnto(a: Vector3D, b: Vector3D): Vector3D {
  const magBSquared = b.x * b.x + b.y * b.y + b.z * b.z;

  if (magBSquared === 0) return { x: 0, y: 0, z: 0 };

  const scalar = dotProduct(a, b) / magBSquared;
  return {
    x: scalar * b.x,
    y: scalar * b.y,
    z: scalar * b.z,
  };
}

/**
 * Unit vector in the direction of v
 */
export function unitVector(v: Vector3D): Vector3D {
  const mag = magnitude(v);

  if (mag === 0) return { x: 0, y: 0, z: 0 };

  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag,
  };
}

/**
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// =============================================================================
// Line and Plane Operations
// =============================================================================

/**
 * Get point on line at parameter λ
 * Line equation: r = a + λd
 */
export function linePointAt(a: Vector3D, d: Vector3D, lambda: number): Vector3D {
  return {
    x: a.x + lambda * d.x,
    y: a.y + lambda * d.y,
    z: a.z + lambda * d.z,
  };
}

/**
 * Find intersection of line and plane
 * Line: r = lineA + λ * lineD
 * Plane: r · planeN = planeA · planeN
 *
 * Returns null if line is parallel to plane (no intersection)
 */
export function linePlaneIntersection(
  lineA: Vector3D,
  lineD: Vector3D,
  planeA: Vector3D,
  planeN: Vector3D
): { point: Vector3D; lambda: number } | null {
  // Check if line is parallel to plane (d · n = 0)
  const dDotN = dotProduct(lineD, planeN);

  if (Math.abs(dDotN) < 0.0001) {
    return null; // Line parallel to plane
  }

  // λ = ((planeA - lineA) · planeN) / (lineD · planeN)
  const diff: Vector3D = {
    x: planeA.x - lineA.x,
    y: planeA.y - lineA.y,
    z: planeA.z - lineA.z,
  };

  const lambda = dotProduct(diff, planeN) / dDotN;
  const point = linePointAt(lineA, lineD, lambda);

  return { point, lambda };
}

/**
 * Calculate perpendicular distance from point to plane
 * Plane defined by point planeA and normal planeN
 */
export function pointToPlaneDistance(
  p: Vector3D,
  planeA: Vector3D,
  planeN: Vector3D
): number {
  const magN = magnitude(planeN);
  if (magN === 0) return 0;

  // Distance = |((p - planeA) · n)| / |n|
  const diff: Vector3D = {
    x: p.x - planeA.x,
    y: p.y - planeA.y,
    z: p.z - planeA.z,
  };

  return Math.abs(dotProduct(diff, planeN)) / magN;
}

/**
 * Find foot of perpendicular from point to plane
 */
export function footOfPerpendicular(
  p: Vector3D,
  planeA: Vector3D,
  planeN: Vector3D
): Vector3D {
  const magNSquared = planeN.x * planeN.x + planeN.y * planeN.y + planeN.z * planeN.z;
  if (magNSquared === 0) return p;

  // Foot = P - ((P - A) · n / |n|²) * n
  const diff: Vector3D = {
    x: p.x - planeA.x,
    y: p.y - planeA.y,
    z: p.z - planeA.z,
  };

  const t = dotProduct(diff, planeN) / magNSquared;

  return {
    x: p.x - t * planeN.x,
    y: p.y - t * planeN.y,
    z: p.z - t * planeN.z,
  };
}

/**
 * Get Cartesian equation coefficients for a plane
 * Returns { a, b, c, d } for ax + by + cz = d
 */
export function planeCartesian(
  planeA: Vector3D,
  planeN: Vector3D
): { a: number; b: number; c: number; d: number } {
  const d = dotProduct(planeA, planeN);
  return {
    a: planeN.x,
    b: planeN.y,
    c: planeN.z,
    d,
  };
}

// =============================================================================
// 2D Vector Operations
// =============================================================================

/**
 * Add two 2D vectors
 */
export function add2D(a: Vector2D, b: Vector2D): Vector2DOperationResult {
  const result: Vector2D = { x: a.x + b.x, y: a.y + b.y };
  return {
    result,
    formula: `(${a.x}, ${a.y}) + (${b.x}, ${b.y}) = (${result.x}, ${result.y})`,
    formulaLatex: `\\mathbf{a} + \\mathbf{b} = \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\end{pmatrix} + \\begin{pmatrix} ${b.x} \\\\ ${b.y} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\end{pmatrix}`,
  };
}

/**
 * Subtract two 2D vectors
 */
export function subtract2D(a: Vector2D, b: Vector2D): Vector2DOperationResult {
  const result: Vector2D = { x: a.x - b.x, y: a.y - b.y };
  return {
    result,
    formula: `(${a.x}, ${a.y}) - (${b.x}, ${b.y}) = (${result.x}, ${result.y})`,
    formulaLatex: `\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\end{pmatrix} - \\begin{pmatrix} ${b.x} \\\\ ${b.y} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\end{pmatrix}`,
  };
}

/**
 * Scalar multiply 2D vector
 */
export function scalarMultiply2D(k: number, a: Vector2D): Vector2DOperationResult {
  const result: Vector2D = { x: k * a.x, y: k * a.y };
  return {
    result,
    formula: `${k} × (${a.x}, ${a.y}) = (${result.x}, ${result.y})`,
    formulaLatex: `${k}\\mathbf{a} = ${k} \\begin{pmatrix} ${a.x} \\\\ ${a.y} \\end{pmatrix} = \\begin{pmatrix} ${result.x} \\\\ ${result.y} \\end{pmatrix}`,
  };
}

/**
 * Magnitude of 2D vector
 */
export function magnitude2D(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Dot product of 2D vectors
 */
export function dotProduct2D(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

/**
 * Angle between 2D vectors in radians
 */
export function angleBetween2D(a: Vector2D, b: Vector2D): number {
  const magA = magnitude2D(a);
  const magB = magnitude2D(b);
  if (magA === 0 || magB === 0) return 0;
  const cosTheta = dotProduct2D(a, b) / (magA * magB);
  return Math.acos(Math.max(-1, Math.min(1, cosTheta)));
}

/**
 * Project 2D vector a onto b
 */
export function projectOnto2D(a: Vector2D, b: Vector2D): Vector2D {
  const magBSquared = b.x * b.x + b.y * b.y;
  if (magBSquared === 0) return { x: 0, y: 0 };
  const scalar = dotProduct2D(a, b) / magBSquared;
  return { x: scalar * b.x, y: scalar * b.y };
}
