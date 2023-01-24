import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// export const $logs = atom(localStorage.getItem("bit_webhook_logs") ? JSON.parse(localStorage.getItem("bit_webhook_logs")) : []);
export const $logId = atom(0);
export const $proxied = atomWithStorage('bit_proxy', false);

export const $logs = atomWithStorage('bit_webhook_logs', [])
export const $randomUrl = atomWithStorage('bit_random_url', '');

export const $currentLog = atom((get) => {
    const logs = get($logs);
    const logId = get($logId);
    return logs[logId];
})