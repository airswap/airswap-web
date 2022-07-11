import { addDays, addHours, addMinutes, addSeconds, addWeeks } from "date-fns";

import getDifferenceBetweenDatesInTimeUnits from "./getDifferenceBetweenDatesInTimeUnits";

describe("getDifferenceBetweenDatesInTimeUnits", () => {
  it("should return the difference in time units between two dates", () => {
    // Add second to prevent tests failing because of 1ms.
    const now = addSeconds(new Date(), 1);
    const result1 = getDifferenceBetweenDatesInTimeUnits(
      addMinutes(now, 1),
      new Date()
    );
    const result2 = getDifferenceBetweenDatesInTimeUnits(
      addHours(now, 2),
      new Date()
    );
    const result3 = getDifferenceBetweenDatesInTimeUnits(
      addDays(now, 3),
      new Date()
    );
    const result4 = getDifferenceBetweenDatesInTimeUnits(
      addDays(addWeeks(now, 4), 4),
      new Date()
    );
    const result5 = getDifferenceBetweenDatesInTimeUnits(
      addDays(addWeeks(now, 4), 7),
      new Date()
    );

    expect(result1.minutes).toBe(1);
    expect(result1.hours).toBe(0);
    expect(result2.hours).toBe(2);
    expect(result3.days).toBe(3);
    expect(result4.weeks).toBe(4);
    expect(result5.weeks).toBe(5);
  });
});
