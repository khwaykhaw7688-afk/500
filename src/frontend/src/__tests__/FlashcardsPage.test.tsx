import { VOCABULARY } from "@/data/vocabulary";
import { FlashcardsPage } from "@/pages/FlashcardsPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("FlashcardsPage", () => {
  it("shows the first card with a progress indicator of 1 / 500", () => {
    render(<FlashcardsPage />);

    const first = VOCABULARY[0];
    expect(screen.getByText(first.hanzi)).toBeInTheDocument();
    expect(screen.getByText("การ์ด 1 / 500")).toBeInTheDocument();

    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "1");
    expect(progress).toHaveAttribute("aria-valuemax", "500");
  });

  it("flips the card to reveal the translation", async () => {
    const user = userEvent.setup();
    render(<FlashcardsPage />);

    const first = VOCABULARY[0];
    const flipButton = screen.getByRole("button", {
      name: `พลิกเพื่อดูคำแปลของ ${first.hanzi}`,
    });
    expect(flipButton).toHaveAttribute("aria-pressed", "false");

    await user.click(flipButton);

    // After flipping, the pinyin and Thai meaning are revealed.
    expect(screen.getByText(first.pinyin)).toBeInTheDocument();
    expect(screen.getByText(first.meaning)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `พลิกกลับเพื่อดูตัวอักษร ${first.hanzi}`,
      }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("advances to the next card with an updated progress indicator", async () => {
    const user = userEvent.setup();
    render(<FlashcardsPage />);

    const second = VOCABULARY[1];
    await user.click(screen.getByLabelText("การ์ดถัดไป"));

    expect(screen.getByText(second.hanzi)).toBeInTheDocument();
    expect(screen.getByText("การ์ด 2 / 500")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "2",
    );
  });

  it("navigates backward to the previous card", async () => {
    const user = userEvent.setup();
    render(<FlashcardsPage />);

    await user.click(screen.getByLabelText("การ์ดถัดไป"));
    await user.click(screen.getByLabelText("การ์ดก่อนหน้า"));

    const first = VOCABULARY[0];
    expect(screen.getByText(first.hanzi)).toBeInTheDocument();
    expect(screen.getByText("การ์ด 1 / 500")).toBeInTheDocument();
  });
});
