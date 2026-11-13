export interface ButtonProps {
  /** Button text */
  label: string;
  /** Click handler */
  onClick?: () => void;
}

/** A plain button. */
export const Button = ({ label, onClick }: ButtonProps) => (
  <button type="button" onClick={onClick}>
    {label}
  </button>
);
