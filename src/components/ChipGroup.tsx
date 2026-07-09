interface ChipGroupProps {
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export default function ChipGroup({ options, selected, onToggle }: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={
              isSelected
                ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-[#d9dee7] px-3 py-1 text-xs text-[#52606d]"
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
