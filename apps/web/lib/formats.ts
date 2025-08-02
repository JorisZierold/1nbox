export const fmt = {
  num(n: number, max = 6) {
    return Intl.NumberFormat(undefined, { maximumFractionDigits: max }).format(
      n
    );
  },
};
