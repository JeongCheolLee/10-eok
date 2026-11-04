export const DATA_TIMEOUT_MS = 12_000;

/** Bounds both connection and response-body parsing; abort frees the underlying request. */
export async function requestJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Data request timed out"));
      controller.abort();
    }, DATA_TIMEOUT_MS);
  });
  try {
    return await Promise.race([
      (async () => {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`Data request failed: ${response.status}`);
        return await response.json() as T;
      })(),
      timeout,
    ]);
  } finally { clearTimeout(timer); }
}
