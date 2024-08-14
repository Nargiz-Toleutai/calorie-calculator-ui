const MacroInfo = ({
  value,
  unit,
  label,
  color,
}: {
  value: number;
  unit: number;
  label: string;
  color: string;
}) => (
  <p className={`font-bold text-${color}`}>
    {value} {unit} {label}
  </p>
);

export default MacroInfo;
