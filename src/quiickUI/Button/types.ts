import { ReactNode } from "react";

export type Props = {
  style?: React.CSSProperties;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary" | "destruct";
  type?: "button" | "reset" | "submit";
  className?: string;
};
