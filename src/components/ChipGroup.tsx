interface ChipGroupProps {
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export default function ChipGroup({ options, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="chipGroup">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`chipButton${isSelected ? " selected" : ""}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
