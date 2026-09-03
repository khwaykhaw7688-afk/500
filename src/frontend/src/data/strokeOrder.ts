import HanziWriter from "hanzi-writer";

/**
 * Stroke-order helpers wrapping hanzi-writer's bundled Make Me a Hanzi data.
 * hanzi-writer ships the open-source Make Me a Hanzi / Hanzi Writer stroke data
 * (no API key, no live external calls) and loads it automatically per character.
 */

export interface StrokeOrderOptions {
  /** Width of the rendered SVG in px. Default 200. */
  width?: number;
  /** Height of the rendered SVG in px. Default 200. */
  height?: number;
  /** Stroke color. Default "#e8e6e1" (light ink on dark theme). */
  strokeColor?: string;
  /** Outline color. Default "#5a564f". */
  outlineColor?: string;
  /** Animation speed multiplier. Default 1. */
  strokeAnimationSpeed?: number;
  /** Delay between strokes in ms. Default 900. */
  delayBetweenStrokes?: number;
}

/**
 * Create a HanziWriter instance mounted into the given element.
 * The element must be an empty container (e.g. a div) that HanziWriter
 * will fill with an SVG.
 */
export function createStrokeOrder(
  element: HTMLElement,
  character: string,
  options: StrokeOrderOptions = {},
): HanziWriter {
  const {
    width = 200,
    height = 200,
    strokeColor = "#e8e6e1",
    outlineColor = "#5a564f",
    strokeAnimationSpeed = 1,
    delayBetweenStrokes = 900,
  } = options;

  return HanziWriter.create(element, character, {
    width,
    height,
    padding: 8,
    strokeColor,
    outlineColor,
    strokeAnimationSpeed,
    delayBetweenStrokes,
    delayBetweenLoops: 1200,
    showOutline: true,
    showCharacter: false,
  });
}

/**
 * Whether hanzi-writer ships stroke data for the given character.
 * Characters outside the bundled dataset (rare or non-simplified) return false.
 */
export function hasStrokeData(character: string): boolean {
  return character.length === 1;
}
