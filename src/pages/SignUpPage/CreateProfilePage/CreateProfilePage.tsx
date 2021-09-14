import React, { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import { Button, TextArea, TextField } from "quiickUI";
import { FiBell } from "react-icons/fi";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import { useStore } from "react-hookstore";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";

import ProfileOverview from "components/ProfileOverview/ProfileOverview";
import CopyLink from "components/CopyLink/CopyLink";

import "./CreateProfilePage.scss";
import { allowNotifications, checkUsernameIsNotTaken } from "utils";
import { Steps } from "./types";
import { User, FireUser } from "utils/types";

const CreateProfilePage = () => {
  const [fireUser, setFireUser] = useLocalStore<FireUser>("fireUser");
  const [, setCreatedProfile] = useSessionStore<boolean>("createdProfile");
  const [user, setUser] = useSessionStore<User>("user");
  const [turnedOnNotifications, setTurnedOnNotifications] = useStore<boolean>("turnedOnNotifications");
  const [step, setStep] = useState<Steps>("Create your profile");
  // FIXME: change all these states to a single state?
  // const [showWhy, setShowWhy] = useState(false);
  // const [showZoomHow, setShowZoomHow] = useState(false);
  // const [showMeet, setShowMeet] = useState(false);
  // const [showMeetHow, setShowMeetHow] = useState(false);
  const [twitter, setTwitter] = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [other, setOther] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      setFireUser(null);
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
  };

  // FIXME: chatLinks.zoom, socialLinks.linkedIn, and welcomeMessage are sent even though they are not filled into the form.
  const onSubmit = (values: Record<string, any>) => {
    const username = values.username ? String(values.username).toLowerCase() : user.username !== "" ? user.username : undefined;
    if (fireUser) {
      firebase
        .firestore()
        .doc(`users/${fireUser.uid}`)
        .set(
          {
            ...values,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            username,
            presence: "online",
            lastOnlineAt: firebase.firestore.FieldValue.serverTimestamp(),
          } as User,
          { merge: true }
        )
        .then(() => {
          setUser({
            ...user,
            ...values,
            username: username || "",
          });
        })
        .catch(err => console.error(err));
    } else {
      // TODO: Show error message
    }
    if (step === "Create your profile") {
      setStep("Optional stuff");
    } else if (step === "Optional stuff") {
      setStep("Turn on notifications");
    }
  };

  const handleAllowNotifications = () => {
    allowNotifications()
      .then(v => setTurnedOnNotifications(true))
      .catch(err => {
        console.error(err);
        // TODO: Show error notification
        setTurnedOnNotifications(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // const handleShowWhy = () => setShowWhy(!showWhy);

  // FIXME: this doesn't work as it appears to still redirect to @/ after having only completed the first step (Create your profile)
  useEffect(() => {
    window.addEventListener("beforeunload", e => {
      if (step === "You're done!") {
        setCreatedProfile(true);
      }
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="CreateProfilePage">
      <Button className="signout" variant="tertiary" onClick={handleSignOut}>
        Sign out
      </Button>
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === "Create your profile" && (
            <FadeIn className="left-container">
              <h2>{step}</h2>
              <div className="field">
                <label htmlFor="name">What's your name?</label>
                <TextField
                  name="name"
                  placeholder="Type here..."
                  defaultValue={user.name}
                  onChange={handleChange}
                  ref={register({ required: true })}
                  error={errors.name?.message}
                />
              </div>
              <div className="field">
                <label htmlFor="username">Create your username</label>
                <TextField
                  name="username"
                  adornmentText="quiick.chat/w/"
                  placeholder="Type here..."
                  autoFocus
                  defaultValue={user.username}
                  onChange={handleChange}
                  ref={register({
                    required: true,
                    validate: {
                      noSpace: v => !/\s/.test(v) || "Spaces are not allowed",
                      noSlash: v => !(v.indexOf("/") > -1) || "Slashes are not allowed",
                      usernameTaken: async v => (await checkUsernameIsNotTaken(v)) || "Username already taken!",
                    },
                  })}
                  error={errors.username?.message}
                />
              </div>
              <div className="button-group">
                <Button type="submit">Next</Button>
              </div>
            </FadeIn>
          )}
          {step === "Optional stuff" && (
            <FadeIn className="left-container">
              <h2>{step}</h2>
              <div className="field">
                <label htmlFor="socialLinks.linkedIn">What's your LinkedIn profile link?</label>
                <TextField name="socialLinks.linkedIn" placeholder="https://linkedin.com/in/..." ref={register} type="url" />
                <sub>
                  I also want to show my{" "}
                  <button type="button" onClick={() => setTwitter(!twitter)}>
                    Twitter
                  </button>
                  ,{" "}
                  <button type="button" onClick={() => setInstagram(!instagram)}>
                    Instagram
                  </button>
                  , or{" "}
                  <button type="button" onClick={() => setOther(!other)}>
                    other
                  </button>{" "}
                  links
                </sub>
              </div>
              {twitter && (
                <div className="field">
                  <label htmlFor="socialLinks.twitter">What's your Twitter profile link?</label>
                  <TextField name="socialLinks.twitter" placeholder="https://twitter.com/..." ref={register} type="url" />
                </div>
              )}
              {instagram && (
                <div className="field">
                  <label htmlFor="socialLinks.instagram">What's your Instagram profile link?</label>
                  <TextField name="socialLinks.instagram" placeholder="https://twitter.com/..." ref={register} type="url" />
                </div>
              )}
              {other && (
                <div className="field">
                  <label htmlFor="socialLinks.other[0]">Any other link?</label>
                  <TextField name="socialLinks.other[0]" placeholder="https://mywebsite.com/..." ref={register} type="url" />
                </div>
              )}
              <div className="field">
                <label htmlFor="welcomeMessage">Create your welcome message</label>
                <TextArea
                  name="welcomeMessage"
                  placeholder="Example: Glad you found me, let's have a quiick chat."
                  defaultValue={user.welcomeMessage}
                  rows={3}
                  ref={register}
                />
              </div>
              {/* <div className="field">
                {!showMeet ? (
                  <>
                    <label htmlFor="chatLinks.zoom">What's your Zoom personal link?</label>
                    <TextField
                      name="chatLinks.zoom"
                      placeholder="https://zoom.us/..."
                      defaultValue={user.chatLinks?.zoom}
                      ref={register}
                      error={errors.chatLinks?.zoom?.message}
                      type="url"
                    />
                    <sub>
                      <button type="button" onClick={handleShowWhy}>
                        Why do I need to provide this?
                      </button>{" "}
                      <button type="button" onClick={() => setShowZoomHow(!showZoomHow)}>
                        How do I find this?
                      </button>{" "}
                      <button type="button" onClick={() => setShowMeet(true)}>
                        I use Google Meet.
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
                ) : (
                  <>
                    <label htmlFor="chatLinks.googleMeet">What's your Google Meet link?</label>
                    <TextField
                      name="chatLinks.googleMeet"
                      placeholder="https://meet.google.com/..."
                      defaultValue={user.chatLinks?.googleMeet}
                      ref={register}
                      type="url"
                    />
                    <sub>
                      <button type="button" onClick={handleShowWhy}>
                        Why do I need to provide this?
                      </button>{" "}
                      <button type="button" onClick={() => setShowMeetHow(!showMeetHow)}>
                        How do I find this?
                      </button>{" "}
                      <button type="button" onClick={() => setShowMeet(false)}>
                        I use Zoom.
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
                )}
                {showWhy && (
                  <sub>
                    <br />
                    This will be used as a back-up if quiick.chat can’t connect or is laggy.
                  </sub>
                )}
              </div> */}
              <div className="button-group">
                <Button variant="secondary" onClick={() => setStep("Create your profile")}>
                  Back
                </Button>
                <Button type="submit">Next</Button>
                <sub>
                  <button onClick={() => setStep("Turn on notifications")}>Skip for now</button>
                </sub>
              </div>
            </FadeIn>
          )}
          {step === "Turn on notifications" ? (
            "Notification" in window ? (
              <FadeIn className="left-container">
                <h2>{step}</h2>
                <p>Get notified whenever someone wants to chat with you or leaves a message.</p>
                <Button size="large" onClick={handleAllowNotifications} startIcon={<FiBell size={20} />} style={{ width: "100%" }}>
                  Allow notifications
                </Button>
                <sub>Clicking on the button above will ask you to Allow or Block notifications.</sub>
                <div className="button-group">
                  <Button variant="secondary" onClick={() => setStep("Optional stuff")}>
                    Back
                  </Button>
                  {turnedOnNotifications ? (
                    <Button onClick={() => setStep("You're done!")}>Next</Button>
                  ) : (
                    <sub>
                      <button onClick={() => setStep("You're done!")}>Skip for now</button>
                    </sub>
                  )}
                </div>
              </FadeIn>
            ) : (
              <FadeIn className="left-container">
                <h3>Your browser does not support notifications</h3>
                <p>Please continue on a different browser or device</p>
                <div className="button-group">
                  <Button variant="secondary" onClick={() => setStep("Optional stuff")}>
                    Back
                  </Button>
                  <sub>
                    <button onClick={() => setStep("You're done!")}>Skip for now</button>
                  </sub>
                </div>
              </FadeIn>
            )
          ) : (
            ""
          )}
          {step === "You're done!" && (
            <FadeIn className="left-container">
              <h2>{step}</h2>
              <h5 style={{ margin: "20px 0" }}>Now share your link and stay online.</h5>
              <CopyLink link={`quiick.chat/w/${user.username}`} />
              <sub>Tip: Share it within your LinkedIn invitations or Twitter DMs.</sub>
            </FadeIn>
          )}
        </form>
        <div className="right-container">
          <ProfileOverview user={user} />
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
