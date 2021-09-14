import React, { useState } from "react";
import { TextField, Button } from "quiickUI";
import { useSessionStore } from "utils/hooks-storage";

import ProfileOverview from "components/ProfileOverview/ProfileOverview";

import "./AskNameView.scss";
import { User, UserProfile } from "utils/types";
import { Props } from "./types";

const AskNameView = ({ askInfo: initAskInfo, onStartChat }: Props) => {
  const [user, setUser] = useSessionStore<User>("user");
  const [user2] = useSessionStore<UserProfile>("user2");
  const [askInfo, setAskInfo] = useState(initAskInfo);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: e.target.value });
  };

  const handleChangeInfo = () => {
    setAskInfo(true);
  };

  return (
    <div className="AskNameView">
      <div className="left-container">
        {askInfo ? (
          <div className="askInfo">
            <label htmlFor="name">What's your name?</label>
            <TextField name="name" placeholder="Type here..." value={user.name} onChange={handleNameChange} />
            <Button onClick={onStartChat}>Start chatting</Button>
          </div>
        ) : (
          <div className="continueAs">
            <h3>Continue as {user.name}?</h3>
            <p>Your profile picture will also be shown to {user2.name}.</p>
            <div className="buttons">
              <Button onClick={onStartChat}>Yes</Button>
              <Button onClick={handleChangeInfo} variant="secondary">
                No
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="right-container">
        <ProfileOverview user={user} dontShow={["username", "presence", "welcomeMessage", "socialLinks"]} />
      </div>
    </div>
  );
};

export default AskNameView;
