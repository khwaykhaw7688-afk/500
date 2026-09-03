import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { VocabularyWord } from "@/types";
import { Link } from "@tanstack/react-router";

interface WordCardProps {
  word: VocabularyWord;
  index: number;
}

/**
 * A single vocabulary card in the deck grid. Shows the Chinese character,
 * pinyin, and Thai meaning, and links to the word detail view.
 */
export function WordCard({ word, index }: WordCardProps) {
  return (
    <Link
      to="/word/$id"
      params={{ id: String(word.id) }}
      className="group block rounded-xl transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      data-ocid={`word.card.${index}`}
    >
      <Card className="h-full gap-2 p-5 transition-smooth group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-4xl font-bold leading-none text-foreground">
            {word.hanzi}
          </span>
          {word.category && (
            <Badge variant="secondary" className="shrink-0">
              {word.category}
            </Badge>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-accent">{word.pinyin}</p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            {word.meaning}
          </p>
        </div>
      </Card>
    </Link>
  );
}
