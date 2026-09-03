import { WritingPracticePage } from "@/pages/WritingPracticePage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("WritingPracticePage", () => {
  it("starts a 10-question quiz with a running score of 0", () => {
    render(<WritingPracticePage />);

    expect(screen.getByText("ข้อ 1 / 10")).toBeInTheDocument();
    expect(screen.getByText("คะแนน: 0")).toBeInTheDocument();
    expect(screen.getByText("ตัวอักษรนี้หมายความว่าอะไร?")).toBeInTheDocument();

    // Four multiple-choice answers are offered.
    const options = screen
      .getAllByRole("button")
      .filter((b) =>
        b.getAttribute("data-ocid")?.startsWith("writing_practice.option."),
      );
    expect(options).toHaveLength(4);
  });

  it("advances through questions and shows the final score with a restart option", async () => {
    const user = userEvent.setup();
    render(<WritingPracticePage />);

    // Answer all 10 questions by picking the first option each time.
    for (let q = 1; q <= 10; q++) {
      expect(screen.getByText(`ข้อ ${q} / 10`)).toBeInTheDocument();
      await user.click(screen.getByTestId("writing_practice.option.1"));
      // Feedback appears after answering.
      expect(
        screen.getByTestId("writing_practice.feedback"),
      ).toBeInTheDocument();
      await user.click(screen.getByTestId("writing_practice.next_button"));
    }

    // Final score screen.
    expect(screen.getByText(/คุณตอบถูก \d+ จาก 10 ข้อ/)).toBeInTheDocument();
    expect(screen.getByText("เริ่มใหม่")).toBeInTheDocument();
  });

  it("restarts the quiz from a fresh 10-question set", async () => {
    const user = userEvent.setup();
    render(<WritingPracticePage />);

    // Answer the first question and advance to question 2.
    await user.click(screen.getByTestId("writing_practice.option.1"));
    await user.click(screen.getByTestId("writing_practice.next_button"));
    expect(screen.getByText("ข้อ 2 / 10")).toBeInTheDocument();

    // Finish the remaining 9 questions.
    for (let q = 2; q <= 10; q++) {
      await user.click(screen.getByTestId("writing_practice.option.1"));
      await user.click(screen.getByTestId("writing_practice.next_button"));
    }

    await user.click(screen.getByText("เริ่มใหม่"));

    // Back to a fresh quiz at question 1 with score reset.
    expect(screen.getByText("ข้อ 1 / 10")).toBeInTheDocument();
    expect(screen.getByText("คะแนน: 0")).toBeInTheDocument();
  });
});
