import React from "react";
import { Button } from "quiickUI";
import { FaGoogle } from "react-icons/fa"; // FIXME: use different icon
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import firebase from "firebase/app";

import { Props } from "./types";
import { FireUser, User } from "utils/types";

const GoogleAuthButton = ({ style, ...rest }: Props) => {
  const [, setFireUser] = useLocalStore<FireUser>("fireUser");
  const [, setUser] = useSessionStore<User>("user");

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleClick = async () => {
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      setUser({
        createdAt: new Date(),
        updatedAt: new Date(),
        lastOnlineAt: new Date(),
        name: user?.displayName || "",
        username: "",
        presence: "online",
        avatar: {
          URL: user?.photoURL || "",
        },
      });
      setFireUser(user);
    } catch (error) {
      console.error(error);
      setFireUser(null);
    }
  };

  return (
    <Button onClick={handleClick} size="large" startIcon={<FaGoogle size={16} color="var(--light-text)" />} style={style} {...rest}>
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
