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
    <div className="segmentGroup">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`segmentButton${isSelected ? " selected" : ""}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
