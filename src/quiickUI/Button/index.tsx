import React from "react";

import { Props } from "./types";
import "./Button.scss";

const Button = ({
  style,
  children,
  startIcon,
  endIcon,
  size = "medium",
  onClick,
  disabled,
  variant = "primary",
  type = "button",
  className,
  ...rest
}: Props) => {
  let theme = "light"; //TODO: Make a theme store and connect this component

  let backgroundColor, color, padding, borderRadius, iconMargin;

  if (variant === "secondary") {
    if (theme === "light") {
      backgroundColor = "var(--dark-background)";
      color = "var(--dark-text)";
    } else if (theme === "dark") {
      backgroundColor = "var(--light-background)";
      color = "var(--light-text)";
    }
  } else if (variant === "tertiary") {
    if (theme === "light") {
      backgroundColor = "var(--light-background)";
      color = "var(--light-text)";
    } else if (theme === "dark") {
      backgroundColor = "var(--dark-background)";
      color = "var(--dark-text)";
    }
  } else if (variant === "destruct") {
    backgroundColor = "var(--denotive-error)";
    color = "var(--dark-text)";
  }

  if (disabled) {
    if (theme === "light") {
      backgroundColor = "var(--light-disabled)";
    } else if (theme === "dark") {
      backgroundColor = "var(--dark-disabled)";
    }
  }

  if (size === "small") {
    padding = "5px 7px";
    borderRadius = "5px";
  } else if (size === "large") {
    padding = "16px 30px";
  }

  if (!children || children === "") {
    iconMargin = "0";
    padding = "10px 10px";
  }

  return (
    <button
      className={`Button ${className || ""}`}
      disabled={disabled}
      style={{ backgroundColor, color, padding, borderRadius, ...style }}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {startIcon && (
        <div className="ButtonStartIcon" style={{ margin: iconMargin }}>
          {startIcon}
        </div>
      )}
      <span>{children}</span>
      {endIcon && (
        <div className="ButtonEndIcon" style={{ margin: iconMargin }}>
          {endIcon}
        </div>
      )}
    </button>
  );
};

export default Button;
