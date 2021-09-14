import React from "react";
import FadeIn from "react-fade-in";
import { Button } from "quiickUI";
import { useSessionStore } from "utils/hooks-storage";

import "./ErrorView.scss";
import { Props } from "./types";
import { UserProfile } from "utils/types";

const ErrorView = ({ onCallAgain, onLeaveAMessage }: Props) => {
  const [user2] = useSessionStore<UserProfile>("user2");

  return (
    <div className="ErrorView">
      <FadeIn className="centerContainer">
        <h3 className="title">
          <span role="img" aria-label="shocked emoji">
            😨
          </span>{" "}
          Uh oh... something went wrong.
        </h3>
        {user2.presence === "online" ? (
          <p className="subtitle">Try calling them again. They're still online.</p>
        ) : (
          <p className="subtitle">{user2.name} is not online anymore or is reconnecting. Please try again later or leave them a message.</p>
        )}
        {user2.presence === "online" ? <Button onClick={onCallAgain}>Call Again</Button> : <Button onClick={onLeaveAMessage}>Leave a message</Button>}
      </FadeIn>
    </div>
  );
};

export default ErrorView;
