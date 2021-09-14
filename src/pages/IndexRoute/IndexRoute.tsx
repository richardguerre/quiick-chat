import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import firebase from "firebase/app";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import { useStore } from "react-hookstore";

import IndexPage from "pages/IndexPage/IndexPage";
import SignUpPage from "pages/SignUpPage/SignUpPage";
import SignInPage from "pages/SignInPage/SignInPage";

import { Props } from "./types";
import { User, FireUser } from "utils/types";
import { changeAvatarURL, notify } from "utils";

const IndexRoute = ({ match }: Props) => {
  const [, setFireUser] = useLocalStore<FireUser>("fireUser");
  const [, setUser] = useSessionStore<User>("user");
  const [, setCreatedProfile] = useSessionStore<boolean>("createdProfile");
  const [, setLoading] = useStore<boolean>("loading");
  const sentDisconnected = useRef<boolean>();

  useEffect(() => {
    const toCancel = firebase.auth().onAuthStateChanged(async initFireUser => {
      if (initFireUser && !initFireUser.isAnonymous) {
        setLoading(true);
        setFireUser(initFireUser);
        try {
          const doc = await firebase.firestore().doc(`users/${initFireUser.uid}`).get();
          if (!doc.exists) {
            setCreatedProfile(false);
            setLoading(false);
            return;
          }
          const data = doc.data() as User;
          if (initFireUser.photoURL && (!data.avatar?.URL || data.avatar.URL !== initFireUser.photoURL)) {
            changeAvatarURL(initFireUser.uid, initFireUser.photoURL);
          }
          setCreatedProfile(true);
          setUser({ ...data, presence: "online" });
          setLoading(false);
        } catch (err) {
          console.error(err);
        }

        // FIXME: Clean up this code (i.e. make more concise), which was copied directly from firebase docs.
        const userStatusDatabaseRef = firebase.database().ref(`/users/${initFireUser.uid}`);
        const isOfflineForDatabase = {
          presence: "offline",
          lastOnlineAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        };

        const isOnlineForDatabase = {
          presence: "online",
          lastOnlineAt: firebase.database.ServerValue.TIMESTAMP,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        };

        const userStatusFirestoreRef = firebase.firestore().doc(`users/${initFireUser.uid}`);

        const isOnlineForFirestore = {
          presence: "online",
          lastOnlineAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        firebase
          .database()
          .ref(".info/connected")
          .on("value", async snapshot => {
            if (snapshot.val() === false) {
              if (!sentDisconnected.current) {
                notify("You went offline", { subtitle: "Click to go back online", requireInteraction: true });
                sentDisconnected.current = true;
                // This setTimeout ensures that future disconnects still get triggered
                setTimeout(() => {
                  sentDisconnected.current = false;
                }, 3000);
              }
              return;
            }
            // setUser({ ...user, presence: "online" });

            try {
              await userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase);
              userStatusDatabaseRef.set(isOnlineForDatabase);
              userStatusFirestoreRef.update(isOnlineForFirestore as User);
            } catch (err) {
              console.error(err);
            }
          });
      } else {
        setFireUser(null);
        setLoading(false);
      }
    });

    return () => toCancel();
    // eslint-disable-next-line
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route exact path={match.url + "signup"} component={SignUpPage} />
      <Route exact path={match.url + "signin"} component={SignInPage} />
      <Route component={() => <h1>Page not found!</h1>} /> {/* TODO: Implement NotFoundPage */}
    </Switch>
  );
};

export default IndexRoute;
