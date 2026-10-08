/** Amounts stay in integer paise; never use floating point for ledger conversion. */
export const money = (value: string | number | bigint | null | undefined) => {
  const n = BigInt(value || 0);
  return (
    "₹" +
    (n / 100n).toLocaleString("en-IN") +
    "." +
    String(n % 100n).padStart(2, "0")
  );
};
export const paise = (value: string) => {
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    throw new Error("Enter an amount with up to two decimal places");
  const [a, b = ""] = value.split(".");
  return (BigInt(a) * 100n + BigInt(b.padEnd(2, "0"))).toString();
};
export const day = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(
    new Date(),
  );
