import { createResource } from '../utils/createResource';
import type { CO2Index, CountryNode, YearRecord } from '../types';

function normalize(raw: unknown): CO2Index {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid JSON root');
  const input = raw as Record<string, unknown>;
  const out: CO2Index = {};
  for (const [key, value] of Object.entries(input)) {
    if (!value || typeof value !== 'object') continue;
    const node = value as Partial<CountryNode> & { data?: unknown };
    const name = (node as { name?: string }).name ?? key;
    const iso_code = (node as { iso_code?: string }).iso_code;
    const region = (node as { region?: string }).region;
    const dataRaw = (node as { data?: unknown }).data;


    const data: YearRecord[] = Array.isArray(dataRaw)
      ? dataRaw
        .map((r) => (typeof r === 'object' && r != null ? (r as YearRecord) : undefined))
        .filter((r): r is YearRecord => !!r && typeof r.year === 'number')
        .sort((a, b) => a.year - b.year)
      : [];


    out[key] = { name, iso_code, region, data };
  }
  return out;
}

export function buildCO2Resource(jsonUrl: string) {
  const promise = new Promise<CO2Index>((resolve, reject) => {
    const worker = new Worker(new URL('../workers/jsonWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (evt: MessageEvent<{ ok: boolean; data?: unknown; error?: string }>) => {
      if (evt.data.ok) {
        try {
          const normalized = normalize(evt.data.data);
          resolve(normalized);
        } catch (e) {
          reject(e);
        } finally {
          worker.terminate();
        }
      } else {
        worker.terminate();
        reject(new Error(evt.data.error ?? 'Worker error'));
      }
    };

    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(e.message));
    };


    worker.postMessage({ url: jsonUrl });
  });

  return createResource(promise);
}