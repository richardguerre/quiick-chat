import { Props as ButtonProps } from "quiickUI/Button/types";

export type Props =
  | ButtonProps
  | {
      style?: React.CSSProperties;
    };
