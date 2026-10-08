import { Field } from "./Field";
export function Input({
  name,
  label,
  defaultValue = "",
  type = "text",
  required = true,
  min,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <Field label={label}>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
      />
    </Field>
  );
}
