import React from "react";
import FadeIn from "react-fade-in";
import { Button } from "quiickUI";
import { useSessionStore } from "utils/hooks-storage";

import ProfileOverview from "components/ProfileOverview/ProfileOverview";

// import "./WelcomeView.scss";
import { Props } from "./types";
import { UserProfile } from "utils/types";

const WelcomeView = ({ onLetsChat, onLeaveAMessage }: Props) => {
  const [user2] = useSessionStore<UserProfile>("user2");

  return (
    <div className="WelcomeView">
      <FadeIn className="center-container">
        <ProfileOverview user={user2} />
        {user2.presence === "online" ? <Button onClick={onLetsChat}>Let's chat!</Button> : <Button onClick={onLeaveAMessage}>Leave a message</Button>}
      </FadeIn>
    </div>
  );
};

export default WelcomeView;
