import { VOCABULARY } from "@/data/vocabulary";
import { VocabularyListPage } from "@/pages/VocabularyListPage";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// WordCard renders a router <Link>; stub it to a plain anchor so the page can be
// rendered without a router provider.
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...rest
  }: {
    to: string;
    params?: Record<string, string>;
    children: ReactNode;
  }) => {
    const href = params ? `${to.replace("$id", params.id)}` : to;
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

// The page persists filters to the URL; reset it between tests so each render
// starts from a clean search state.
afterEach(() => {
  window.history.replaceState(null, "", "/");
});

function resultCount(): string {
  return screen.getByTestId("vocab.result_count").textContent ?? "";
}

describe("VocabularyListPage", () => {
  it("renders all 500 vocabulary cards with hanzi, pinyin, and Thai meaning", () => {
    render(<VocabularyListPage />);

    expect(VOCABULARY).toHaveLength(500);
    expect(screen.getByText("คำศัพท์ภาษาจีน 500 คำ")).toBeInTheDocument();

    const list = screen.getByTestId("vocab.list");
    // Every card is rendered.
    expect(within(list).getAllByRole("link")).toHaveLength(500);

    // Spot-check a known card's content (hanzi, pinyin, Thai meaning).
    expect(screen.getByText("一")).toBeInTheDocument();
    expect(screen.getByText("yī")).toBeInTheDocument();
    expect(screen.getByText("หนึ่ง")).toBeInTheDocument();
  });

  it("filters the list when searching by a Thai meaning", async () => {
    const user = userEvent.setup();
    render(<VocabularyListPage />);

    const search = screen.getByLabelText("ค้นหาคำศัพท์");
    await user.type(search, "ที่หนึ่ง");

    // Only the matching card remains.
    expect(resultCount()).toBe("พบ 1 คำ");
    expect(screen.getByText("ที่หนึ่ง")).toBeInTheDocument();
    expect(screen.queryByText("หนึ่ง")).not.toBeInTheDocument();
  });

  it("filters the list when searching by pinyin", async () => {
    const user = userEvent.setup();
    render(<VocabularyListPage />);

    const search = screen.getByLabelText("ค้นหาคำศัพท์");
    await user.type(search, "bǎi");

    expect(resultCount()).toBe("พบ 1 คำ");
    expect(screen.getByText("ร้อย")).toBeInTheDocument();
  });

  it("shows an empty state when no card matches the search", async () => {
    const user = userEvent.setup();
    render(<VocabularyListPage />);

    const search = screen.getByLabelText("ค้นหาคำศัพท์");
    await user.type(search, "zzzzzz");

    expect(screen.getByText("ไม่พบคำศัพท์ที่ค้นหา")).toBeInTheDocument();
    expect(screen.queryByTestId("vocab.list")).not.toBeInTheDocument();
  });
});
