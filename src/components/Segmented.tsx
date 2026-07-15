interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              isSelected
                ? "rounded border border-primary bg-[#eaf2fc] px-3 py-1.5 text-sm font-semibold text-primary"
                : "rounded border border-[#d9dee7] px-3 py-1.5 text-sm text-[#52606d]"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
