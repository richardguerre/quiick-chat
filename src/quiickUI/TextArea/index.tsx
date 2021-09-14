import React from "react";
import { Props, Ref } from "./types";
import "./TextArea.scss";

const TextArea = (
  {
    id,
    name,
    cols,
    rows,
    style,
    disabled,
    placeholder,
    value,
    onChange,
    helperNode,
    helperText,
    spellCheck,
    readOnly,
    autoFocus,
    required,
    error,
    defaultValue,
    className,
    autoComplete = "on",
    ...rest
  }: Props,
  ref: Ref
) => {
  let theme = "light"; //TODO: Make a theme store and connect this component

  let backgroundColor, color, cursor;

  if (theme === "light") {
    backgroundColor = "var(--light-container)";
    color = "var(--light-text)";
  } else if (theme === "dark") {
    backgroundColor = "var(--dark-container)";
    color = "var(--dark-text)";
  }

  if (disabled) {
    cursor = "not-allowed";
    if (theme === "light") {
      backgroundColor = "var(--light-disabled)";
    } else if (theme === "dark") {
      backgroundColor = "var(--dark-disabled)";
    }
  }

  return (
    <>
      <div className={`TextArea ${className || ""}`} style={{ backgroundColor, color, cursor, ...style }}>
        <textarea
          id={id}
          name={name}
          cols={cols}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          ref={ref}
          value={value}
          onChange={onChange}
          spellCheck={spellCheck}
          readOnly={readOnly}
          autoFocus={autoFocus}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          {...rest}
        />
      </div>
      {error &&
        (error === "" ? (
          <sub className="error">
            Required!
            <br />
          </sub>
        ) : (
          <sub className="error">
            {error}
            <br />
          </sub>
        ))}
      {helperText && (
        <sub className="helperText">
          {helperText}
          <br />
        </sub>
      )}
      {helperNode}
    </>
  );
};

const forwardTextArea = React.forwardRef(TextArea);

export default forwardTextArea;
