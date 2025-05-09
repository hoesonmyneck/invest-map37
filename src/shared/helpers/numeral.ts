import numeral from "numeral";

export const Numeral = (n: number): string => {
  if (!n) return "0";

  if (n < 1e6) {
    return new Intl.NumberFormat().format(
      Number.isInteger(n) ? n : Math.round(n)
    );
  }

  if (n > 1e9) {
    return `${new Intl.NumberFormat().format(
      +((Number.isInteger(n) ? n : Math.round(n)) / 1e9).toFixed(0)
    )} млрд.`;
  }

  const formatted = numeral(n).format("0.0a");
  return formatted
    .replace("k", " тыс.")
    .replace("m", " млн.")
    .replace("b", " млрд.")
    .replace("t", " трлн.");
};

export const NumeralWithDecimal = (n: number): string => {
  if (!n) return "0";

  if (n > 0 && n < 100) {
    return new Intl.NumberFormat('ru-RU', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }).format(n);
  }
  
  return Numeral(n);
};
