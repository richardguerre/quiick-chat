import React from "react";
import { useForm } from "react-hook-form";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import { generate } from "shortid";
import firebase from "firebase/app";
import FadeIn from "react-fade-in";
import { Button, TextField } from "quiickUI";

import "./LeaveAMessageView.scss";
import { User, Chat, UserProfile, FireUser } from "utils/types";

const LeaveAMessageView = () => {
  const [fireUser] = useLocalStore<FireUser>("fireUser");
  const [user, setUser] = useSessionStore<User>("user");
  const [user2] = useSessionStore<UserProfile>("user2");

  const { register, handleSubmit, errors } = useForm();

  const onLeaveMessage = (values: Record<string, any>) => {
    setUser({ ...user, name: values.name });
    if (user2.uid && fireUser?.uid) {
      const chat: Chat = {
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        startedChatAt: firebase.firestore.FieldValue.serverTimestamp(),
        callerName: values.name,
        textChat: [
          {
            id: generate(),
            uid: fireUser.uid,
            message: values.message,
            leftAsMessage: true,
          },
        ],
      };
      firebase
        .firestore()
        .doc(`users/${user2.uid}/chats/${fireUser.uid}`)
        .set(chat)
        .catch(err => console.error(err));
    } else {
      // TODO: Show error message
    }
  };

  return (
    <form className="LeaveAMessageView" onSubmit={handleSubmit(onLeaveMessage)}>
      <FadeIn className="center-container">
        <label htmlFor="name">What's your name?</label>
        <TextField
          name="name"
          placeholder="Type here..."
          autoFocus
          defaultValue={user.name}
          ref={register({ required: true })}
          error={errors.name?.message}
        />
        <label htmlFor="message">Leave a message</label>
        <TextField name="message" placeholder="Type here..." ref={register({ required: true })} error={errors.message?.message} />
        {/* TODO: replace this with TextArea */}
        <Button type="submit">Send</Button>
      </FadeIn>
    </form>
  );
};

export default LeaveAMessageView;
