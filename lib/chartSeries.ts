export type ChartPoint = { date: string; value: number; principal: number };

/** Display-only reduction. Keep each bucket's extrema and explicit milestone dates.
 * Return source indices so irregularly selected points keep their original x position.
 * Calculations and pointer readouts must continue to use the complete daily series.
 */
export function chartIndices(series: ChartPoint[], budget = 120, milestones: string[] = []): number[] {
  if (series.length <= budget) return series.map((_, i) => i);
  const keep = new Set<number>([0, series.length - 1]);
  for (const date of milestones) {
    const index = series.findIndex((point) => point.date === date);
    if (index >= 0) keep.add(index);
  }
  const buckets = Math.max(1, Math.floor((budget - keep.size) / 4));
  for (let b = 0; b < buckets; b++) {
    const start = 1 + Math.floor(b * (series.length - 2) / buckets);
    const end = 1 + Math.floor((b + 1) * (series.length - 2) / buckets);
    let low = start, high = start, lowPrincipal = start, highPrincipal = start;
    for (let i = start + 1; i < end; i++) {
      if (series[i].value < series[low].value) low = i;
      if (series[i].value > series[high].value) high = i;
      if (series[i].principal < series[lowPrincipal].principal) lowPrincipal = i;
      if (series[i].principal > series[highPrincipal].principal) highPrincipal = i;
    }
    keep.add(low); keep.add(high); keep.add(lowPrincipal); keep.add(highPrincipal);
  }
  return [...keep].sort((a, b) => a - b);
}
