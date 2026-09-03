export interface VocabularyWord {
  /** Stable numeric id used for routing and lookups */
  id: number;
  /** The Chinese character(s) */
  hanzi: string;
  /** Pinyin romanization with tone marks */
  pinyin: string;
  /** Thai meaning */
  meaning: string;
  /** Optional category grouping (e.g. "ตัวเลข", "อาหาร") */
  category?: string;
}

export type SortKey = "id" | "pinyin" | "hanzi";
export type SortDirection = "asc" | "desc";
