import React from "react";

import GoogleAuthButton from "./GoogleAuthButton/GoogleAuthButton";

import "./AuthButtons.scss";

const AuthButtons = () => {
  return (
    <div className="AuthButtons">
      <GoogleAuthButton style={{ width: "100%" }} />
    </div>
  );
};

export default AuthButtons;
