import { createStore } from "react-hookstore";
import { createLocalStore, createSessionStore } from "utils/hooks-storage";
import { Chat, User } from "utils/firestore";
import { UserProfile, FireUser } from "utils/types";

let turnedOnNotifications = false;
if ("Notification" in window) {
  turnedOnNotifications = Notification.permission === "granted";
}

createStore<boolean>("loading", true);
createStore<boolean>("turnedOnNotifications", turnedOnNotifications);

createSessionStore<User>("user", {
  createdAt: new Date(),
  updatedAt: new Date(),
  lastOnlineAt: new Date(),
  name: "",
  username: "",
  presence: "offline",
});
createSessionStore<UserProfile>("user2", {
  name: "",
});
createSessionStore<boolean>("createdProfile", false);
createSessionStore<Chat>("chat", {
  createdAt: new Date(),
  updatedAt: new Date(),
  startedChatAt: new Date(),
  callerName: "",
});

// Reason for change to store whole auth().currentUser object: https://stackoverflow.com/questions/60170407/is-it-safe-to-store-firebase-user-credential-token-on-local-or-session-storage
createLocalStore<FireUser>("fireUser", null);
