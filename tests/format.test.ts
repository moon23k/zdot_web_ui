import { describe, expect, it } from "vitest";
import { dayLabel, kstDate, kstDotDate, kstMonthDay, kstSchedule, kstToday, won } from "../src/utils/format";

describe("format", () => {
  it("formats won and KST dates", () => {
    expect(won(1234567)).toBe("1,234,567원");
    expect(kstDate("2026-01-01T15:30:00Z")).toBe("2026. 01. 02.");
    expect(kstDotDate("2026-01-01T15:30:00Z")).toBe("2026.01.02");
    expect(kstMonthDay("2026-01-01T15:30:00Z")).toBe("01. 02.");
    expect(kstToday(new Date("2026-01-01T15:30:00Z"))).toBe("2026-01-02");
  });

  it("drops the time for midnight schedules", () => {
    expect(kstSchedule("2026-01-09T15:00:00Z")).toBe("1월 10일 (토)");
    expect(kstSchedule("2026-01-10T05:00:00Z")).toBe("1월 10일 (토) 오후 02:00");
  });

  it("labels a calendar day", () => {
    expect(dayLabel("2026-01-10")).toBe("1월 10일 토");
    expect(dayLabel("2026-01-10", "dot")).toBe("1.10 토");
    expect(dayLabel("2026-01-10", "date")).toBe("1월 10일");
  });
});
