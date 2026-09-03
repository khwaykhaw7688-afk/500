import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { vi } from "vitest";

// Generated components use data-ocid attributes as their stable test hooks.
configure({ testIdAttribute: "data-ocid" });

// hanzi-writer manipulates the DOM heavily (SVG, pointer events, requestAnimationFrame)
// and is not needed to verify the app's observable behavior. Mock the stroke-order
// factory so StrokeOrder / WritingCanvas render without touching the real library.
vi.mock("@/data/strokeOrder", () => ({
  createStrokeOrder: vi.fn(() => ({
    animateCharacter: vi.fn(),
    hideCharacter: vi.fn(),
    quiz: vi.fn(),
    cancelQuiz: vi.fn(),
  })),
  hasStrokeData: vi.fn(() => true),
}));

// jsdom does not implement the Web Speech API. The app's speakChinese() already
// degrades gracefully when speechSynthesis is absent, but providing a stub keeps
// the audio path exercised without real voices.
Object.defineProperty(window, "speechSynthesis", {
  value: {
    cancel: vi.fn(),
    speak: vi.fn(),
    getVoices: vi.fn(() => []),
    onvoiceschanged: null,
  },
  configurable: true,
});
