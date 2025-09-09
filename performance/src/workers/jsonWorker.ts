/// <reference lib="webworker" />

export type WorkerRequest = {
  url: string;
};

export type WorkerResponse<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

self.onmessage = async <T>(evt: MessageEvent<WorkerRequest>) => {
  try {
    const { url } = evt.data;
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const json: T = await res.json();
    const payload: WorkerResponse<T> = { ok: true, data: json };
    (self as unknown as Worker).postMessage(payload);
  } catch (e) {
    const payload: WorkerResponse = { ok: false, error: (e as Error).message };
    (self as unknown as Worker).postMessage(payload);
  }
};

export {};
