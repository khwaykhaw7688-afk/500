import { StrokeOrder } from "@/components/StrokeOrder";
import { WritingCanvas } from "@/components/WritingCanvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VOCABULARY } from "@/data/vocabulary";
import { speakChinese } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { VocabularyWord } from "@/types";
import { CheckCircle2, RotateCcw, Volume2, XCircle } from "lucide-react";
import { useState } from "react";

const QUIZ_SIZE = 10;
const OPTION_COUNT = 4;

interface QuizQuestion {
  word: VocabularyWord;
  options: string[];
  correctIndex: number;
}

/** Pick `count` unique random words from the vocabulary deck. */
function pickRandomWords(count: number): VocabularyWord[] {
  const pool = [...VOCABULARY];
  const picked: VocabularyWord[] = [];
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

/** Build a question with the correct meaning plus unique distractor meanings. */
function buildQuestion(word: VocabularyWord): QuizQuestion {
  const distractors = VOCABULARY.filter(
    (w) => w.id !== word.id && w.meaning !== word.meaning,
  );
  const shuffled = [...distractors].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, OPTION_COUNT - 1).map((w) => w.meaning);

  const options = [...chosen, word.meaning].sort(() => Math.random() - 0.5);
  const correctIndex = options.indexOf(word.meaning);
  return { word, options, correctIndex };
}

function buildQuiz(): QuizQuestion[] {
  return pickRandomWords(QUIZ_SIZE).map(buildQuestion);
}

export function WritingPracticePage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz());
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const question = questions[current];
  const answered = selected !== null;
  const isCorrect = answered && selected === question.correctIndex;

  const handleRestart = () => {
    setQuestions(buildQuiz());
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (finished) {
    const perfect = score === questions.length;
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-12 sm:px-6">
        <Card className="w-full text-center">
          <CardHeader className="items-center gap-3">
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full",
                perfect
                  ? "bg-accent/20 text-accent"
                  : "bg-primary/15 text-primary",
              )}
            >
              {perfect ? (
                <CheckCircle2 className="size-9" aria-hidden="true" />
              ) : (
                <RotateCcw className="size-9" aria-hidden="true" />
              )}
            </span>
            <CardTitle className="font-display text-2xl">
              {perfect ? "ยอดเยี่ยมมาก!" : "จบแบบฝึกหัดแล้ว"}
            </CardTitle>
            <CardDescription className="text-base">
              คุณตอบถูก {score} จาก {questions.length} ข้อ
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-5xl font-bold text-gradient">
                {score}
              </span>
              <span className="text-2xl text-muted-foreground">
                / {questions.length}
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleRestart}
              data-ocid="writing_practice.restart_button"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              เริ่มใหม่
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      {/* Progress + score header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" data-ocid="writing_practice.progress">
            ข้อ {current + 1} / {questions.length}
          </Badge>
          <Badge variant="outline" data-ocid="writing_practice.score">
            คะแนน: {score}
          </Badge>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          {questions.map((question, i) => (
            <span
              key={question.word.id}
              className={cn(
                "h-1.5 w-6 rounded-full transition-colors",
                i < current
                  ? "bg-primary"
                  : i === current
                    ? "bg-accent"
                    : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <Card>
        <CardHeader className="items-center gap-2 text-center">
          <CardDescription>ตัวอักษรนี้หมายความว่าอะไร?</CardDescription>
          <div className="flex items-center gap-4">
            <span className="font-display text-7xl font-bold text-foreground">
              {question.word.hanzi}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => speakChinese(question.word.hanzi)}
              aria-label={`ฟังเสียงอ่าน ${question.word.hanzi}`}
              data-ocid="writing_practice.speak_button"
              className="size-10"
            >
              <Volume2 className="size-5" aria-hidden="true" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {question.word.pinyin}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Stroke order + practice canvas */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                ลำดับขีด
              </p>
              <StrokeOrder
                character={question.word.hanzi}
                width={200}
                height={200}
                className="w-full"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                ฝึกเขียน
              </p>
              <WritingCanvas
                character={question.word.hanzi}
                width={200}
                height={200}
                className="w-full"
              />
            </div>
          </div>

          {/* Answer options */}
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const isThisCorrect = index === question.correctIndex;
              const isThisSelected = index === selected;
              return (
                <button
                  key={`${question.word.id}-${index}`}
                  type="button"
                  onClick={() => handleSelect(index)}
                  disabled={answered}
                  data-ocid={`writing_practice.option.${index + 1}`}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-base font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "hover:bg-accent hover:text-accent-foreground",
                    !answered && "border-input bg-background",
                    answered &&
                      isThisCorrect &&
                      "border-success bg-success/10 text-success",
                    answered &&
                      isThisSelected &&
                      !isThisCorrect &&
                      "border-destructive bg-destructive/10 text-destructive",
                    answered &&
                      !isThisSelected &&
                      !isThisCorrect &&
                      "border-border opacity-50",
                  )}
                >
                  <span>{option}</span>
                  {answered && isThisCorrect && (
                    <CheckCircle2
                      className="size-5 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {answered && isThisSelected && !isThisCorrect && (
                    <XCircle className="size-5 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback + next */}
          {answered && (
            <div className="flex flex-col items-center gap-4">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCorrect ? "text-success" : "text-destructive",
                )}
                data-ocid="writing_practice.feedback"
              >
                {isCorrect
                  ? "ถูกต้อง! เก่งมาก"
                  : `คำตอบที่ถูกคือ "${question.options[question.correctIndex]}"`}
              </p>
              <Button
                size="lg"
                onClick={handleNext}
                data-ocid="writing_practice.next_button"
              >
                {current + 1 >= questions.length ? "ดูผลคะแนน" : "ข้อถัดไป"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
