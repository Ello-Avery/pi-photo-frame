import "./Segmented.css";

interface SegmentedProps<T extends string | number> {
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** A row of radio options shown as one segmented button bar. */
const Segmented = <T extends string | number>({
  name,
  options,
  value,
  onChange,
}: SegmentedProps<T>) => {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((option) => (
        <label className="segmented__option" key={option.value}>
          <input
            type="radio"
            name={name}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          <span className="segmented__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default Segmented;
