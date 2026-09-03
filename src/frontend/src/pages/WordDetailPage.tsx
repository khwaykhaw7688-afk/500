import { StrokeOrder } from "@/components/StrokeOrder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VOCABULARY, getWordById } from "@/data/vocabulary";
import { speakChinese } from "@/lib/audio";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";

export function WordDetailPage() {
  const { id } = useParams({ strict: false });
  const wordId = Number(id);
  const word = getWordById(wordId);

  if (!word) {
    return (
      <div
        className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center"
        data-ocid="word.not_found"
      >
        <span className="font-display text-6xl font-bold text-muted-foreground/40">
          无
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">ไม่พบคำศัพท์นี้</h1>
        <p className="mt-2 text-muted-foreground">ไม่พบคำศัพท์ที่คุณกำลังดูอยู่</p>
        <Button asChild className="mt-6">
          <Link to="/" data-ocid="word.back_to_list">
            กลับไปยังรายการคำศัพท์
          </Link>
        </Button>
      </div>
    );
  }

  const index = VOCABULARY.findIndex((w) => w.id === word.id);
  const prev = index > 0 ? VOCABULARY[index - 1] : undefined;
  const next =
    index < VOCABULARY.length - 1 ? VOCABULARY[index + 1] : undefined;
  const characters = Array.from(word.hanzi);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back navigation */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-6 -ml-2 text-muted-foreground"
        data-ocid="word.back_link"
      >
        <Link to="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          กลับไปยังรายการคำศัพท์
        </Link>
      </Button>

      {/* Hero card */}
      <Card className="gap-0 overflow-hidden p-0">
        <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <span className="font-display text-7xl font-bold leading-none text-foreground sm:text-8xl">
              {word.hanzi}
            </span>
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <p className="text-lg font-semibold text-accent">{word.pinyin}</p>
              <p className="text-xl font-medium text-foreground">
                {word.meaning}
              </p>
              {word.category && (
                <Badge variant="secondary" className="mt-1">
                  {word.category}
                </Badge>
              )}
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={() => speakChinese(word.hanzi)}
            className="shrink-0"
            data-ocid="word.audio_button"
          >
            <Volume2 className="size-4" aria-hidden="true" />
            ฟังเสียงอ่าน
          </Button>
        </CardContent>
      </Card>

      {/* Stroke order */}
      <section className="mt-8" aria-labelledby="stroke-order-heading">
        <h2
          id="stroke-order-heading"
          className="mb-4 font-display text-xl font-semibold"
        >
          ลำดับขีด
        </h2>
        <Card className="gap-0 p-6">
          <CardContent className="flex flex-wrap items-center justify-center gap-6 px-0">
            {characters.map((ch) => (
              <div key={ch} className="flex flex-col items-center gap-2">
                <StrokeOrder
                  character={ch}
                  width={160}
                  height={160}
                  label={`ลำดับขีดของตัวอักษร ${ch}`}
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {ch}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Prev / next navigation */}
      <nav
        className="mt-8 flex items-center justify-between gap-4"
        aria-label="นำทางคำศัพท์"
      >
        {prev ? (
          <Button asChild variant="outline">
            <Link
              to="/word/$id"
              params={{ id: String(prev.id) }}
              data-ocid="word.prev"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  ก่อนหน้า
                </span>
                <span className="block truncate font-medium">
                  {prev.hanzi} · {prev.meaning}
                </span>
              </span>
            </Link>
          </Button>
        ) : (
          <span />
        )}

        {next ? (
          <Button asChild variant="outline">
            <Link
              to="/word/$id"
              params={{ id: String(next.id) }}
              data-ocid="word.next"
            >
              <span className="min-w-0 text-right">
                <span className="block text-xs text-muted-foreground">
                  ถัดไป
                </span>
                <span className="block truncate font-medium">
                  {next.hanzi} · {next.meaning}
                </span>
              </span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
