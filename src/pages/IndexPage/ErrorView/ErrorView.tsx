import React from "react";
import FadeIn from "react-fade-in";
import { Button } from "quiickUI";

import "./ErrorView.scss";

const ErrorView = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="ErrorView">
      <FadeIn className="centerContainer">
        <h3 className="title">
          <span role="img" aria-label="shocked emoji">
            😨
          </span>{" "}
          Uh oh... something went wrong.
        </h3>
        <p className="subtitle">Really sorry about this. Please try refreshing the page or trying on a different browser.</p>
        <Button onClick={handleRefresh}>Refresh</Button>
      </FadeIn>
    </div>
  );
};

export default ErrorView;
