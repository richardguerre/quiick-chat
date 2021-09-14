export type Props = {
  id?: string;
  name?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
  adornmentText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  helperNode?: React.ReactNode;
  value?: string | number | readonly string[];
  spellCheck?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  type?: "text" | "url";
  className?: string;
  autoComplete?: "on" | "off";
};

export type Ref = string | ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined;
