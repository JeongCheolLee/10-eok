import { describe, expect, it } from "vitest";
import { closedSessionBar } from "./closedSession";

const sec = (date: string) => Date.parse(date) / 1000;
describe("daily prices use completed exchange sessions", () => {
  const session = { start: sec("2026-11-06T09:00:00+09:00"), end: sec("2026-11-06T15:30:00+09:00") };
  it("keeps yesterday and removes the in-progress Korean daily bar during the morning refresh", () => {
    const now = sec("2026-11-06T11:35:00+09:00");
    expect(closedSessionBar(session.start - 86400, session, now)).toBe(true);
    expect(closedSessionBar(session.start, session, now)).toBe(false);
    expect(closedSessionBar(now, session, now)).toBe(false);
  });
  it("includes the session once closed, but never future bars", () => {
    expect(closedSessionBar(session.start, session, session.end)).toBe(true);
    expect(closedSessionBar(session.start + 86400, session, session.end)).toBe(false);
  });
  it("uses exchange-provided early close times instead of a fixed UTC cutoff", () => {
    const early = { start: sec("2026-11-27T09:30:00-05:00"), end: sec("2026-11-27T13:00:00-05:00") };
    expect(closedSessionBar(early.start, early, early.end - 1)).toBe(false);
    expect(closedSessionBar(early.start, early, early.end)).toBe(true);
  });
  it("keeps historical bars when metadata describes the next trading session", () => {
    expect(closedSessionBar(session.start - 86400, session, session.start - 3600)).toBe(true);
  });
  it("fails instead of silently treating prices as closes if session metadata is missing", () => {
    expect(() => closedSessionBar(1, undefined as never, 2)).toThrow("session");
  });
});
