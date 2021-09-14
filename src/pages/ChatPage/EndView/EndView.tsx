import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import FadeIn from "react-fade-in";
import { Button } from "quiickUI";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";

import ProfileOverview from "components/ProfileOverview/ProfileOverview";

import "./EndView.scss";
import { UserProfile, FireUser } from "utils/types";

const EndView = () => {
  const [user2] = useSessionStore<UserProfile>("user2");
  const [fireUser] = useLocalStore<FireUser>("fireUser");

  const history = useHistory();

  const handleGoToSignup = () => history.push("/signup");

  if (!fireUser) return <></>;

  return (
    <div className="EndView">
      <FadeIn className="centerContainer">
        <h3 className="title">The call has ended.</h3>
        <p className="subtitle">Go connect with {user2.name} now!</p>
        <ProfileOverview user={user2} dontShow={["welcomeMessage"]} />
      </FadeIn>
      {(fireUser.isAnonymous || true) && (
        <FadeIn className="promoteQuiickChat">
          <sub>Like quiick chat? Sign up to create your own link.</sub>
          <Button onClick={handleGoToSignup}>Sign up</Button>
        </FadeIn>
      )}
    </div>
  );
};

export default withRouter(EndView);
