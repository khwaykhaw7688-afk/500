import { WordCard } from "@/components/WordCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VOCABULARY } from "@/data/vocabulary";
import { useVocabulary } from "@/hooks/useVocabulary";
import type { SortDirection, SortKey } from "@/types";
import { ArrowDown, ArrowUp, Search, X } from "lucide-react";
import { useMemo } from "react";

interface ListSearch {
  q?: string;
  cat?: string;
  sort?: SortKey;
  dir?: SortDirection;
}

const CATEGORIES: string[] = [
  ...new Set(
    VOCABULARY.map((w) => w.category).filter(
      (c): c is string => typeof c === "string",
    ),
  ),
].sort((a, b) => a.localeCompare(b, "th"));

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "id", label: "ลำดับ" },
  { value: "hanzi", label: "ตัวอักษร" },
  { value: "pinyin", label: "พินอิน" },
];

function readSearchParams(): ListSearch {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") ?? undefined;
  const cat = params.get("cat") ?? undefined;
  const sort = (params.get("sort") as SortKey) ?? undefined;
  const dir = (params.get("dir") as SortDirection) ?? undefined;
  return { q, cat, sort, dir };
}

function writeSearchParams(patch: Partial<ListSearch>) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const set = (key: string, value?: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };
  set("q", patch.q);
  set("cat", patch.cat);
  set("sort", patch.sort);
  set("dir", patch.dir);
  const qs = params.toString();
  window.history.replaceState(
    null,
    "",
    qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
  );
}

export function VocabularyListPage() {
  const initial = useMemo(() => readSearchParams(), []);

  const initialFilters = useMemo(
    () => ({
      search: initial.q ?? "",
      category: initial.cat || undefined,
      sortKey: (initial.sort as SortKey) ?? "id",
      sortDirection: (initial.dir as SortDirection) ?? "asc",
    }),
    [initial],
  );

  const {
    filters,
    filtered,
    setSearch,
    setCategory,
    setSortKey,
    toggleSortDirection,
  } = useVocabulary(initialFilters);

  const handleSearch = (value: string) => {
    setSearch(value);
    writeSearchParams({ q: value || undefined });
  };

  const handleCategory = (value: string) => {
    setCategory(value === "all" ? undefined : value);
    writeSearchParams({ cat: value === "all" ? undefined : value });
  };

  const handleSortKey = (value: SortKey) => {
    setSortKey(value);
    writeSearchParams({ sort: value });
  };

  const handleToggleDirection = () => {
    toggleSortDirection();
    writeSearchParams({
      dir: filters.sortDirection === "asc" ? "desc" : "asc",
    });
  };

  const hasActiveFilters = Boolean(filters.search || filters.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page header */}
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          คลังคำศัพท์
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          คำศัพท์ภาษาจีน 500 คำ
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          ค้นหาและเรียงลำดับคำศัพท์พื้นฐานภาษาจีน พร้อมพินอินและความหมายภาษาไทย
          คลิกที่การ์ดเพื่อดูลำดับขีดและฟังเสียงอ่าน
        </p>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ค้นหาด้วยตัวอักษรจีน พินอิน หรือความหมายไทย…"
            className="pl-9 pr-9"
            aria-label="ค้นหาคำศัพท์"
            data-ocid="vocab.search_input"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-smooth hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="ล้างการค้นหา"
              data-ocid="vocab.clear_search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.category ?? "all"}
            onValueChange={handleCategory}
          >
            <SelectTrigger
              className="w-auto min-w-36"
              aria-label="กรองตามหมวดหมู่"
              data-ocid="vocab.category_select"
            >
              <SelectValue placeholder="ทุกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortKey} onValueChange={handleSortKey}>
            <SelectTrigger
              className="w-auto min-w-32"
              aria-label="เรียงลำดับตาม"
              data-ocid="vocab.sort_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleToggleDirection}
            aria-label={
              filters.sortDirection === "asc"
                ? "เรียงจากน้อยไปมาก"
                : "เรียงจากมากไปน้อย"
            }
            title={
              filters.sortDirection === "asc"
                ? "เรียงจากน้อยไปมาก"
                : "เรียงจากมากไปน้อย"
            }
            data-ocid="vocab.sort_direction"
          >
            {filters.sortDirection === "asc" ? (
              <ArrowUp className="size-4" aria-hidden="true" />
            ) : (
              <ArrowDown className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Result meta */}
      <div className="mb-4 flex items-center justify-between">
        <p
          className="text-sm text-muted-foreground"
          data-ocid="vocab.result_count"
        >
          พบ {filtered.length} คำ
        </p>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              handleSearch("");
              handleCategory("all");
            }}
            data-ocid="vocab.reset_filters"
          >
            ล้างตัวกรอง
          </Button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          data-ocid="vocab.list"
        >
          {filtered.map((word, i) => (
            <WordCard key={word.id} word={word} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center"
          data-ocid="vocab.empty_state"
        >
          <span className="font-display text-5xl font-bold text-muted-foreground/40">
            无
          </span>
          <h2 className="mt-4 font-display text-xl font-semibold">
            ไม่พบคำศัพท์ที่ค้นหา
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองหมวดหมู่เพื่อดูคำศัพท์ทั้งหมด
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={() => {
              handleSearch("");
              handleCategory("all");
            }}
            data-ocid="vocab.empty_reset"
          >
            แสดงคำศัพท์ทั้งหมด
          </Button>
        </div>
      )}
    </div>
  );
}
