import { Flashcard } from "@/components/Flashcard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VOCABULARY } from "@/data/vocabulary";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useMemo, useState } from "react";

const ALL_CATEGORIES = "ทั้งหมด";

function getCategories(): string[] {
  const set = new Set<string>();
  for (const word of VOCABULARY) {
    if (word.category) set.add(word.category);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "th"));
}

export function FlashcardsPage() {
  const categories = useMemo(getCategories, []);

  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [shuffled, setShuffled] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    const filtered = VOCABULARY.filter(
      (word) => category === ALL_CATEGORIES || word.category === category,
    );
    if (!shuffled) return filtered;
    const copy = [...filtered];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [category, shuffled]);

  const total = deck.length;
  const current = deck[index];

  const goTo = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setIndex(0);
    setFlipped(false);
  };

  const handleShuffle = () => {
    setShuffled((s) => !s);
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          บัตรคำศัพท์
        </h1>
        <p className="max-w-md text-muted-foreground">
          แตะการ์ดเพื่อพลิกดูคำแปลและพินอิน แล้วกดปุ่มลำโพงเพื่อฟังเสียงอ่าน
        </p>
      </header>

      {/* Controls */}
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger
            className="w-44"
            aria-label="เลือกหมวดหมู่"
            data-ocid="flashcards.filter"
          >
            <SelectValue placeholder="หมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>{ALL_CATEGORIES}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={shuffled ? "default" : "outline"}
          onClick={handleShuffle}
          data-ocid="flashcards.shuffle"
        >
          <Shuffle className="size-4" aria-hidden="true" />
          {shuffled ? "เรียงตามลำดับ" : "สลับการ์ด"}
        </Button>
      </div>

      {/* Progress */}
      <div className="flex w-full max-w-md items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          การ์ด {total === 0 ? 0 : index + 1} / {total}
        </span>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          tabIndex={-1}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-label="ความคืบหน้า"
        >
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-300"
            style={{
              width: total === 0 ? "0%" : `${((index + 1) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card area */}
      {total === 0 ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-10 text-center shadow-subtle"
          data-ocid="flashcards.empty_state"
        >
          <p className="font-display text-lg font-semibold">ไม่มีการ์ดในหมวดนี้</p>
          <p className="text-sm text-muted-foreground">
            ลองเลือกหมวดหมู่อื่นเพื่อเริ่มทบทวน
          </p>
        </div>
      ) : (
        <div
          key={`${category}-${shuffled}-${index}`}
          className="animate-flip-in"
        >
          <Flashcard
            word={current}
            flipped={flipped}
            onFlip={() => setFlipped((f) => !f)}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goTo(Math.max(0, index - 1))}
          disabled={index === 0 || total === 0}
          aria-label="การ์ดก่อนหน้า"
          data-ocid="flashcards.prev"
          className="size-11"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Button>
        <Badge variant="secondary" className="px-3 py-1 text-sm">
          {total === 0 ? 0 : index + 1} / {total}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goTo(Math.min(total - 1, index + 1))}
          disabled={index >= total - 1 || total === 0}
          aria-label="การ์ดถัดไป"
          data-ocid="flashcards.next"
          className="size-11"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
