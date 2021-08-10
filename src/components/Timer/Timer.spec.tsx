import { render, screen } from "@testing-library/react";

import Timer from "./Timer";

jest.useFakeTimers();

describe("Timer", () => {
  it("should increment index by 3 after 3 second", () => {
    const start: number = parseInt(
      ((new Date().getTime() + 300000) / 1000).toFixed(0)
    );

    render(<Timer expiryTime={start} onTimerComplete={() => void 1} />);

    setTimeout(() => {
      screen.getByText("4:57");
    }, 1500);
  });
});
