import { Button } from "@/components/ui/button";
import { speakChinese } from "@/lib/audio";
import type { VocabularyWord } from "@/types";
import { Volume2 } from "lucide-react";

interface FlashcardProps {
  word: VocabularyWord;
  flipped: boolean;
  onFlip: () => void;
}

/**
 * A reusable 3D flip card. Front shows the Chinese character(s); the back
 * reveals the pinyin and Thai meaning. A speaker button plays pronunciation.
 */
export function Flashcard({ word, flipped, onFlip }: FlashcardProps) {
  return (
    <div
      className="group relative h-80 w-full max-w-md cursor-pointer [perspective:1400px] sm:h-96"
      data-ocid="flashcard"
    >
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `พลิกกลับเพื่อดูตัวอักษร ${word.hanzi}`
            : `พลิกเพื่อดูคำแปลของ ${word.hanzi}`
        }
        className="block h-full w-full text-left outline-none focus-visible:outline-none"
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front — Chinese character */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-2xl border bg-card p-8 shadow-elevated [backface-visibility:hidden]">
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {word.category}
            </span>
            <span className="font-display text-7xl font-bold tracking-tight text-foreground sm:text-8xl">
              {word.hanzi}
            </span>
            <span className="text-sm text-muted-foreground">แตะเพื่อดูคำแปล</span>
          </div>

          {/* Back — pinyin + Thai meaning */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border bg-gradient-primary p-8 text-primary-foreground shadow-elevated [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              {word.category}
            </span>
            <span className="font-display text-3xl font-semibold tracking-wide sm:text-4xl">
              {word.pinyin}
            </span>
            <span className="text-center font-display text-2xl font-bold sm:text-3xl">
              {word.meaning}
            </span>
          </div>
        </div>
      </button>

      {/* Speaker button */}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          speakChinese(word.hanzi);
        }}
        aria-label={`ฟังเสียงอ่านของ ${word.hanzi}`}
        className="absolute right-4 top-4 z-10 size-11 rounded-full shadow-subtle"
        data-ocid="flashcard.speak"
      >
        <Volume2 className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
