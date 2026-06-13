// Central date formatting. Always renders in Thailand time (UTC+7) so output is
// deterministic across server + client (no hydration mismatch).
const TH_DATE_TIME = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

/** Format an ISO string / Date as `dd/MM/yyyy HH:mm` (Asia/Bangkok). */
export const formatDateTime = (value: string | Date): string => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const p = Object.fromEntries(
        TH_DATE_TIME.formatToParts(date).map((part) => [part.type, part.value])
    );

    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};
