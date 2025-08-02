"use client";

import { networks } from "@/lib/wagmi-config";

export function ChainPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {Object.values(networks).map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
