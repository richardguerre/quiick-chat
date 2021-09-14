import firebase from "firebase/app";

import { User } from "utils/types";
import notificationIcon from "static/notificationIcon.png";
const notificationSound = require("static/notificationSound.mp3");

export const changeAvatarURL = (uid: string, URL: string) => {
  firebase
    .firestore()
    .doc(`users/${uid}`)
    .update({
      avatar: {
        URL,
      },
    } as User);
};

export const checkUsernameIsNotTaken = async (value: string) => {
  const reserved = ["me", "you", "contact", "support", "quiick", "quiickchat", "quiick.chat", "CEO", "username"].map(el => el.toLowerCase());
  const username = value.toLowerCase();
  if (reserved.includes(username)) return false;
  try {
    const querySnap = await firebase.firestore().collection("users").where("username", "==", username).get();
    const uid = firebase.auth().currentUser?.uid;
    return !(!querySnap.empty && querySnap.docs[0].id !== uid);
  } catch (error) {
    console.error(error);
  }
};

export const changeToOnline = (uid: string) => {
  return firebase
    .firestore()
    .doc(`users/${uid}`)
    .update({ updatedAt: firebase.firestore.FieldValue.serverTimestamp(), presence: "online" } as User);
};

export const inFocus = () => {
  return !document.hidden;
};

export const allowNotifications = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return "Notifications are on!";
    } else if (permission === "denied") {
      throw new Error("Notifications are blocked!");
    } else if (permission === "default") {
      throw new Error("Choice is unknown. Please try again.");
    }
  } else {
    throw new Error("The browser does not support notifications.");
  }
};

export type NotifyOptions = {
  ignoreFocus?: boolean;
  subtitle?: string;
  icon?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  audioPath?: string;
  audioTimeout?: number;
  onClick?: () => void;
};

export const notify = (title: string, options?: NotifyOptions) => {
  if (options?.ignoreFocus || !inFocus()) {
    const notification = new Notification(title, {
      body: options?.subtitle || "Click to open quiick.chat",
      icon: options?.icon || notificationIcon,
      requireInteraction: options?.requireInteraction || false,
    });
    notification.onclick = () => {
      options?.onClick?.() || window.focus();
      notification.close();
    };
    const audio = new Audio(options?.audioPath || notificationSound);
    if (options?.audioTimeout) {
      audio.loop = true;
      setTimeout(() => {
        audio.pause();
      }, options?.audioTimeout);
    }
    if (!options?.silent) audio.play().catch(err => console.error(err));
  }
};
