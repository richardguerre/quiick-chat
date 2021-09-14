import React from "react";

import LogoLight from "static/Logos/light.svg";
import LogoDark from "static/Logos/dark.svg";

const Logo = () => {
  let theme = "light"; //TODO: Make theme store and connect this component

  const handleClick = () => {
    window.location.href = "/";
  };

  return <img className="Logo" onClick={handleClick} src={theme === "dark" ? LogoDark : LogoLight} alt={`quiick chat logo ${theme}`} />;
};

export default Logo;
