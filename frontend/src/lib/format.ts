export const formatCurrency = (n: number | string) =>
    Number(n ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 });