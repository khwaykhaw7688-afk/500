import { Button } from "@/components/ui/button";
import { createStrokeOrder } from "@/data/strokeOrder";
import { cn } from "@/lib/utils";
import { Eraser, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface WritingCanvasProps {
  /** The Chinese character the user should practice writing. */
  character: string;
  /** Optional className for the wrapping container. */
  className?: string;
  /** Width of the drawing surface in px. */
  width?: number;
  /** Height of the drawing surface in px. */
  height?: number;
  /** Accessible label describing the practice surface. */
  label?: string;
}

/**
 * Practice writing canvas built on hanzi-writer's quiz mode.
 * The user traces the character with pointer input; a hint toggle reveals
 * the correct strokes and a clear button wipes the surface for another try.
 */
export function WritingCanvas({
  character,
  className,
  width = 240,
  height = 240,
  label,
}: WritingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<ReturnType<typeof createStrokeOrder> | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !character) return;

    const writer = createStrokeOrder(container, character, {
      width,
      height,
      strokeColor: "#e8e6e1",
      outlineColor: "#5a564f",
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 900,
    });
    writerRef.current = writer;

    // Start in quiz mode so the user can draw the character.
    void writer.quiz({
      onComplete: () => {
        // Briefly flash the correct strokes after a completed attempt.
        void writer.animateCharacter();
      },
    });

    return () => {
      writer.hideCharacter();
      writerRef.current = null;
    };
  }, [character, width, height]);

  const handleClear = () => {
    const writer = writerRef.current;
    if (!writer) return;
    writer.cancelQuiz();
    void writer.quiz({
      onComplete: () => {
        void writer.animateCharacter();
      },
    });
  };

  const handleToggleHint = () => {
    const writer = writerRef.current;
    if (!writer) return;
    if (showHint) {
      writer.cancelQuiz();
      void writer.quiz({
        onComplete: () => {
          void writer.animateCharacter();
        },
      });
    } else {
      writer.cancelQuiz();
      void writer.animateCharacter();
    }
    setShowHint((prev) => !prev);
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        ref={containerRef}
        role="img"
        aria-label={label ?? `พื้นที่ฝึกเขียนตัวอักษร ${character}`}
        className="flex items-center justify-center rounded-xl border border-border bg-background p-2"
      />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToggleHint}
          aria-pressed={showHint}
          data-ocid="writing_canvas.hint_button"
        >
          <Eye className="size-4" aria-hidden="true" />
          {showHint ? "ซ่อนตัวอย่าง" : "ดูตัวอย่าง"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          data-ocid="writing_canvas.clear_button"
        >
          <Eraser className="size-4" aria-hidden="true" />
          ล้าง
        </Button>
      </div>
    </div>
  );
}
