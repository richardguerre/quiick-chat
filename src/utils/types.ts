import firebase from "firebase/app";
import { User as FirestoreUser, Chat as FirestoreChat, TextChat as FirestoreTextChat, Timestamp } from "utils/firestore/generatedTypes";

export type User = FirestoreUser;
export type Chat = FirestoreChat;
export type TextChat = FirestoreTextChat;

export type UserProfile = {
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  username?: string;
  presence?: "online" | "offline";
  lastOnlineAt?: Timestamp;
  avatar?: {
    URL?: string;
  };
  chatLinks?: {
    zoom?: string;
    googleMeet?: string;
  };
  socialLinks?: {
    linkedIn?: string;
    twitter?: string;
    instagram?: string;
    other?: string[];
  };
  welcomeMessage?: string;

  uid?: string;
};

export type FireUser = firebase.User | null;
