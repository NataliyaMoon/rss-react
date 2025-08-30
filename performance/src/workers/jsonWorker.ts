/// <reference lib="webworker" />

export type WorkerRequest = {
  url: string;
};

export type WorkerResponse = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

self.onmessage = async (evt: MessageEvent<WorkerRequest>) => {
  try {
    const { url } = evt.data;
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const json = await res.json();
    const payload: WorkerResponse = { ok: true, data: json };
    (self as unknown as Worker).postMessage(payload);
  } catch (e) {
    const payload: WorkerResponse = { ok: false, error: (e as Error).message };
    (self as unknown as Worker).postMessage(payload);
  }
};

export { };