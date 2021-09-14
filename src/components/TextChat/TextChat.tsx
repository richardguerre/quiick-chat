import React from "react";
import { useForm } from "react-hook-form";
import { Button, TextField } from "quiickUI";
import firebase from "firebase/app";
import FadeIn from "react-fade-in";
import { generate } from "shortid";

import Message from "./Message/Message";

import "./TextChat.scss";
import { Props } from "./types";
import { TextChat as TextChatType } from "utils/types";

const TextChat = ({ chat, uid, userId, chatId }: Props) => {
  const { register, handleSubmit, reset } = useForm();

  const onSendMessage = (values: Record<string, any>) => {
    reset();
    firebase
      .firestore()
      .doc(`users/${userId}/chats/${chatId}`)
      .set(
        {
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          textChat: firebase.firestore.FieldValue.arrayUnion({
            id: generate(),
            uid,
            message: values.message,
          } as TextChatType),
        },
        { merge: true }
      )
      .catch(err => console.error(err));
  };

  return (
    <FadeIn className="TextChat">
      <div className="messages">
        {chat?.textChat ? (
          chat.textChat?.map((text, i) => <Message key={i} text={text.message} sender={text.uid === uid} />)
        ) : (
          <sub className="startBySaying">
            Start by saying hi{" "}
            <span role="img" aria-label="wave emoji">
              👋
            </span>
          </sub>
        )}
      </div>
      <form className="input" onSubmit={handleSubmit(onSendMessage)}>
        <TextField name="message" placeholder="Send a message..." autoComplete="off" ref={register} /> {/* TODO: replace this with TextArea */}
        <Button type="submit">Send</Button>
      </form>
    </FadeIn>
  );
};

export default TextChat;
