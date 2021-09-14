import React, { useState } from "react";
import { Button, TextArea, TextField } from "quiickUI";
import FadeIn from "react-fade-in";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import "./EditProfileView.scss";
import { FireUser, User } from "utils/types";
import { checkUsernameIsNotTaken } from "utils";

const EditProfileView = () => {
  const [fireUser] = useLocalStore<FireUser>("fireUser");
  const [user, setUser] = useSessionStore<User>("user");
  const [isEditing, setIsEditing] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [showZoomHow, setShowZoomHow] = useState(false);
  const [showMeetHow, setShowMeetHow] = useState(false);
  const { register, handleSubmit, errors } = useForm<User>({ defaultValues: user });

  const onSubmit = async (v: User) => {
    console.log(v);
    if (fireUser) {
      try {
        await firebase
          .firestore()
          .doc(`users/${fireUser.uid}`)
          .set(
            {
              ...user,
              ...v,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            } as User,
            { merge: true }
          );
        setUser(v);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      // TODO: Show error message
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowWhy = () => setShowWhy(!showWhy);

  if (!isEditing) {
    return (
      <Button variant="secondary" onClick={() => setIsEditing(true)}>
        Edit profile
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="EditProfileView">
      <FadeIn>
        <div className="field">
          <label htmlFor="name">What's your name?</label>
          <TextField name="name" placeholder="Type here..." onChange={handleChange} ref={register({ required: true })} error={errors.name?.message} />
        </div>
        <div className="field">
          <label htmlFor="username">Change your username</label>
          <TextField
            name="username"
            adornmentText="quiick.chat/w/"
            placeholder="Type here..."
            onChange={handleChange}
            error={errors.username?.message}
            ref={register({
              required: true,
              validate: {
                noSpace: v => !/\s/.test(v) || "Spaces are not allowed",
                noSlash: v => !(v.indexOf("/") > -1) || "Slashes are not allowed",
                usernameTaken: async v => (await checkUsernameIsNotTaken(v)) || "Username already taken!",
              },
            })}
          />
        </div>
        <div className="field">
          <label htmlFor="socialLinks.linkedIn">What's your LinkedIn profile link?</label>
          <TextField
            name="socialLinks.linkedIn"
            placeholder="https://linkedin.com/in/..."
            defaultValue={user.socialLinks?.linkedIn}
            ref={register}
            type="url"
          />
        </div>
        <div className="field">
          <label htmlFor="socialLinks.twitter">What's your Twitter profile link?</label>
          <TextField
            name="socialLinks.twitter"
            placeholder="https://twitter.com/..."
            defaultValue={user.socialLinks?.twitter}
            ref={register}
            type="url"
          />
        </div>
        <div className="field">
          <label htmlFor="socialLinks.instagram">What's your Instagram profile link?</label>
          <TextField
            name="socialLinks.instagram"
            placeholder="https://twitter.com/..."
            defaultValue={user.socialLinks?.instagram}
            ref={register}
            type="url"
          />
        </div>
        <div className="field">
          <label htmlFor="socialLinks.other[0]">Any other link?</label>
          <TextField
            name="socialLinks.other[0]"
            placeholder="https://mywebsite.com/..."
            defaultValue={user.socialLinks?.other?.[0]}
            ref={register}
            type="url"
          />
        </div>
        <div className="field">
          <label htmlFor="welcomeMessage">Create your welcome message</label>
          <TextArea
            name="welcomeMessage"
            placeholder="Example: Glad you found me, let's have a quiick chat."
            onChange={handleChange}
            rows={3}
            ref={register}
          />
        </div>
        <div className="field">
          <label htmlFor="chatLinks.zoom">What's your Zoom personal link?</label>
          <TextField
            name="chatLinks.zoom"
            placeholder="https://zoom.us/..."
            defaultValue={user.chatLinks?.zoom}
            ref={register}
            error={errors.chatLinks?.zoom?.message}
            type="url"
            helperNode={
              <>
                <sub>
                  <button type="button" onClick={handleShowWhy}>
                    Why do I need to provide this?
                  </button>{" "}
                  <button type="button" onClick={() => setShowZoomHow(!showZoomHow)}>
                    How do I find this?
                  </button>
                </sub>
                {showZoomHow && (
                  <sub>
                    <br />
                    Sign in to Zoom. Select the{" "}
                    <a href="https://zoom.us/profile" target="_blank" style={{ color: "inherit" }} rel="noopener noreferrer">
                      Profile
                    </a>{" "}
                    tab. Copy your Personal link.
                  </sub>
                )}
              </>
            }
          />
        </div>
        <div className="field">
          <label htmlFor="chatLinks.googleMeet">What's your Google Meet link?</label>
          <TextField
            name="chatLinks.googleMeet"
            placeholder="https://meet.google.com/..."
            defaultValue={user.chatLinks?.zoom}
            ref={register}
            type="url"
            helperNode={
              <>
                <sub>
                  <button type="button" onClick={handleShowWhy}>
                    Why do I need to provide this?
                  </button>{" "}
                  <button type="button" onClick={() => setShowMeetHow(!showMeetHow)}>
                    How do I find this?
                  </button>
                </sub>
                {showMeetHow && (
                  <sub>
                    <br />
                    Get one{" "}
                    <a href="https://meet.google.com/" target="_blank" style={{ color: "inherit" }} rel="noopener noreferrer">
                      here
                    </a>
                    . (This link will expire in 90 days)
                  </sub>
                )}
              </>
            }
          />
          {showWhy && (
            <sub>
              <br />
              This will be used as a back-up if quiick.chat can’t connect or is laggy.
            </sub>
          )}
        </div>
        <div className="buttonGroup">
          <Button onClick={() => setIsEditing(false)} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </FadeIn>
    </form>
  );
};

export default EditProfileView;
