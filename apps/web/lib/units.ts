export const toUnits = (amount: string, decimals: number) =>
  BigInt(Math.round(Number(amount || "0") * 10 ** decimals)).toString();

export const fromUnits = (amount: string | bigint, decimals: number) => {
  const n = BigInt(amount || 0);
  const d = BigInt(10 ** decimals);
  return (Number(n) / Number(d)).toString();
};
