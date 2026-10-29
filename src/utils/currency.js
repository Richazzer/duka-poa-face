export const formatTZS = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "TZS 0";
  return `TZS ${Number(amount).toLocaleString('en-US')}`;
};
