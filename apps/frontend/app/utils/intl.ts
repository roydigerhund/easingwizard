export const defaultLocale = (navigator.language || 'en').substring(0, 2).toLowerCase();

export const formatNumber = (num?: number, decimals?: number) =>
  Number.isNaN(num) || num === undefined || num === null
    ? undefined
    : Intl.NumberFormat(defaultLocale, { maximumFractionDigits: decimals }).format(num);
