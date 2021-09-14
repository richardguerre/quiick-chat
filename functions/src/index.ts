import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as admin from "firebase-admin";

admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.
exports.onUserStatusChanged = functions.database.ref("/users/{uid}").onUpdate(async (change, context) => {
  // Get the data written to Realtime Database
  const eventStatus = change.after.val();

  // Then use other event data to create a reference to the
  // corresponding Firestore document.
  const userStatusFirestoreRef = firestore.doc(`users/${context.params.uid}`);

  // It is likely that the Realtime Database change that triggered
  // this event has already been overwritten by a fast change in
  // online / offline status, so we'll re-read the current data
  // and compare the timestamps.
  const statusSnapshot = await change.after.ref.once("value");
  const status = statusSnapshot.val();
  console.log(status, eventStatus);
  // If the current timestamp for this data is newer than
  // the data that triggered this event, we exit this function.
  if (status.updatedAt > eventStatus.updatedAt) {
    return null;
  }

  // Otherwise, we convert the updatedAt field to a Date
  eventStatus.updatedAt = new Date(eventStatus.updatedAt);

  // logic for lastOnlineAt
  if (eventStatus.presence === "offline") {
    eventStatus.lastOnlineAt = new Date();
  }

  // ... and write it to Firestore.
  return userStatusFirestoreRef.update(eventStatus);
});
