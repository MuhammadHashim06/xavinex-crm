import React from "react";

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, required = true }) => {
  return (
    <div>
      <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{label}</label>
      <div className="relative group">
        <input 
          required={required}
          type="date" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent transition-all duration-300 group-hover:border-accent/50 [color-scheme:dark]"
        />
      </div>
    </div>
  );
};

export default DateInput;
