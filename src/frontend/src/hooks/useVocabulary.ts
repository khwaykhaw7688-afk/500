import { VOCABULARY } from "@/data/vocabulary";
import type { SortDirection, SortKey, VocabularyWord } from "@/types";
import { useMemo, useState } from "react";

export interface VocabularyFilters {
  /** Search term matched against hanzi, pinyin, or Thai meaning. */
  search: string;
  /** Optional category filter. */
  category?: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
}

const DEFAULT_FILTERS: VocabularyFilters = {
  search: "",
  sortKey: "id",
  sortDirection: "asc",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(word: VocabularyWord, search: string): boolean {
  const q = normalize(search);
  if (!q) return true;
  return (
    normalize(word.hanzi).includes(q) ||
    normalize(word.pinyin).includes(q) ||
    normalize(word.meaning).includes(q)
  );
}

function compareWords(
  a: VocabularyWord,
  b: VocabularyWord,
  key: SortKey,
): number {
  switch (key) {
    case "pinyin":
      return a.pinyin.localeCompare(b.pinyin, "zh");
    case "hanzi":
      return a.hanzi.localeCompare(b.hanzi, "zh");
    default:
      return a.id - b.id;
  }
}

/**
 * Search / filter / sort logic for the 500-word vocabulary deck.
 * Filtering and sorting state is owned by the caller (survives refresh via URL).
 */
export function useVocabulary(initialFilters: Partial<VocabularyFilters> = {}) {
  const [filters, setFilters] = useState<VocabularyFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const setSearch = (search: string) => setFilters((f) => ({ ...f, search }));
  const setCategory = (category?: string) =>
    setFilters((f) => ({ ...f, category }));
  const setSortKey = (sortKey: SortKey) =>
    setFilters((f) => ({ ...f, sortKey }));
  const setSortDirection = (sortDirection: SortDirection) =>
    setFilters((f) => ({ ...f, sortDirection }));
  const toggleSortDirection = () =>
    setFilters((f) => ({
      ...f,
      sortDirection: f.sortDirection === "asc" ? "desc" : "asc",
    }));

  const filtered = useMemo(() => {
    const { search, category, sortKey, sortDirection } = filters;
    const result = VOCABULARY.filter(
      (word) =>
        matchesSearch(word, search) &&
        (!category || word.category === category),
    );
    result.sort((a, b) => {
      const cmp = compareWords(a, b, sortKey);
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return result;
  }, [filters]);

  return {
    filters,
    filtered,
    setSearch,
    setCategory,
    setSortKey,
    setSortDirection,
    toggleSortDirection,
  };
}
