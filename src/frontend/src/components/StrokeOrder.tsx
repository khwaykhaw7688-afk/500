import { createStrokeOrder } from "@/data/strokeOrder";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface StrokeOrderProps {
  /** The Chinese character to animate. */
  character: string;
  /** Optional className for the wrapping container. */
  className?: string;
  /** Width of the SVG in px. */
  width?: number;
  /** Height of the SVG in px. */
  height?: number;
  /** Accessible label describing the animation. */
  label?: string;
}

/**
 * Shared stroke-order animation component built on hanzi-writer.
 * Renders an animated SVG showing the correct stroke order for a character.
 */
export function StrokeOrder({
  character,
  className,
  width = 200,
  height = 200,
  label,
}: StrokeOrderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !character) return;

    const writer = createStrokeOrder(container, character, {
      width,
      height,
    });

    // Start the animation once the character data has loaded.
    void writer.animateCharacter();

    return () => {
      writer.hideCharacter();
    };
  }, [character, width, height]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label ?? `ลำดับขีดของตัวอักษร ${character}`}
      className={cn("flex items-center justify-center", className)}
    />
  );
}
