export function Badge({ value }: { value: string }) {
  return (
    <span
      className={
        "pill " +
        (/failed|unknown|Overdue|Reversed/i.test(value)
          ? "bad"
          : /pending|draft|queued|Due|test/i.test(value)
            ? "warn"
            : "")
      }
    >
      {value?.replaceAll("_", " ")}
    </span>
  );
}
