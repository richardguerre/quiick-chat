export type Props = {
  id?: string;
  name?: string;
  cols?: number;
  rows?: number;
  style?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  helperText?: string;
  helperNode?: React.ReactNode;
  value?: string | number | readonly string[];
  spellCheck?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  className?: string;
  autoComplete?: "on" | "off";
};

export type Ref = string | ((instance: HTMLTextAreaElement | null) => void) | React.RefObject<HTMLTextAreaElement> | null | undefined;
