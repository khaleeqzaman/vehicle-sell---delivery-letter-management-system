// Converts numbers to Pakistani Lakh / Crore currency words
export function numberToPakistaniRupees(num: number): string {
  if (isNaN(num) || num <= 0) return "";

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + units[n % 10] : "") + " ";
    } else if (n >= 10) {
      str += teens[n - 10] + " ";
    } else if (n > 0) {
      str += units[n] + " ";
    }
    return str.trim();
  }

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const remaining = num;

  if (crore > 0) {
    result += convertChunk(crore) + " Crore ";
  }
  if (lakh > 0) {
    result += convertChunk(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    result += convertChunk(thousand) + " Thousand ";
  }
  if (remaining > 0) {
    result += convertChunk(remaining) + " ";
  }

  return (result.trim() + " Rupees Only").replace(/\s+/g, " ");
}
