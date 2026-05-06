import type { ReactNode } from 'react';

interface CustomInputProps {
  label: string;
  icon: ReactNode;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CustomInput({ label, icon, placeholder, type = 'text', value, onChange }: CustomInputProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-2 mb-2 text-[#345348] font-medium">
        {icon}
        <label>{label}</label>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="w-full p-4 text-lg border-2 border-[#D1D5DB] rounded-2xl bg-white focus:outline-none focus:border-[#345348] placeholder-gray-400"
      />
    </div>
  );
}