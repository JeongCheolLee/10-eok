type Session = { start: number; end: number };

/** Yahoo includes an in-progress daily bar in historical responses.
 * Session boundaries are Unix seconds from the exchange (including DST/short days).
 */
export function closedSessionBar(timestamp: number, session: Session, now: number): boolean {
  if (!Number.isFinite(session?.start) || !Number.isFinite(session?.end) || session.end <= session.start) {
    throw new Error("Yahoo regular trading session missing or invalid");
  }
  return timestamp <= now && (timestamp < session.start || now >= session.end);
}
