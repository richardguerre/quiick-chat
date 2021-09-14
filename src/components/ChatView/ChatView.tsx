import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import firebase from "firebase/app";
import { Button } from "quiickUI";
import { FiMessageSquare, FiMic, FiVideo, FiVideoOff, FiMicOff, FiPhone } from "react-icons/fi";

import ProfileOverview from "components/ProfileOverview/ProfileOverview";
import TextChat from "components/TextChat/TextChat";

import "./ChatView.scss";
import { Props } from "./types";
import { Chat, UserProfile, FireUser } from "utils/types";

const ChatView = ({ stream, stream2, userId, chatId, dontListen, onToggleVideo, onHangup, connected, showVideo2, defaultOpenChat }: Props) => {
  const [fireUser] = useLocalStore<FireUser>("fireUser");
  const [user2] = useSessionStore<UserProfile>("user2");
  const [chat, setChat] = useSessionStore<Chat>("chat");
  const [openChat, setOpenChat] = useState(defaultOpenChat);
  const [showUserVideo, setShowUserVideo] = useState(true);
  const [enableUserAudio, setEnableUserAudio] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  const handleToggleAudio = () => {
    if (stream && stream.active) {
      const newState = !stream.getAudioTracks()[0].enabled;
      stream.getAudioTracks()[0].enabled = newState;
      setEnableUserAudio(newState);
    }
  };

  const handleToggleVideo = () => {
    if (stream && stream.active) {
      const newState = !stream.getVideoTracks()[0].enabled;
      stream.getVideoTracks()[0].enabled = newState;
      onToggleVideo && onToggleVideo(newState);
      setShowUserVideo(newState);
    }
  };

  const handleHangup = () => {
    onHangup();
  };

  // FIXME: Remove this useEffect and instead have it in ChatPage.tsx
  useEffect(() => {
    if (!dontListen) {
      const toCancel = firebase
        .firestore()
        .doc(`users/${userId}/chats/${chatId}`)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data() as Chat;
            setChat(data);
          }
        });
      return () => toCancel();
    } else {
      // TODO: show error
    }

    window.addEventListener("beforeunload", handleHangup);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (stream2 && stream2.active) {
      if (videoRef2.current) {
        videoRef2.current.srcObject = stream2;
      } else console.error("videoRef2 is not connected to video element");
    }
  }, [stream2]);

  useEffect(() => {
    if (stream && stream.active) {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else console.error("videoRef2 is not connected to video element");
    }
  }, [stream]);

  const videoStyle2: CSSProperties = {
    opacity: showVideo2 && stream2 ? 1 : 0,
  };

  const videoStyle: CSSProperties = {
    opacity: showUserVideo ? 1 : 0,
  };

  if (!fireUser?.uid) return <></>; // TODO: trigger loading

  return (
    <div className="ChatView">
      <div className="VideoChat-container">
        <div className="videos">
          <div className="video2-container">
            <video autoPlay ref={videoRef2} style={videoStyle2} />
            <span style={videoStyle2}>{user2.name}</span>
          </div>
          <div className="video-container">
            <video autoPlay muted ref={videoRef} style={videoStyle} />
            <div className="video-background">Your video is disabled!</div>
          </div>
          <div className="back-container">
            <ProfileOverview user={user2} dontShow={["presence", "welcomeMessage", "username", "socialLinks"]} />
            {!connected && <h5>Waiting for {user2.name}...</h5>}
          </div>
        </div>
        <div className="callButtons">
          <div className="centerButtons">
            <Button onClick={handleToggleVideo} startIcon={showUserVideo ? <FiVideo size={20} /> : <FiVideoOff size={20} />}></Button>
            <Button
              className="hangupButton"
              onClick={handleHangup}
              startIcon={<FiPhone size={24} style={{ transform: "rotate(135deg)" }} />}
            ></Button>
            <Button onClick={handleToggleAudio} startIcon={enableUserAudio ? <FiMic size={20} /> : <FiMicOff size={20} />}></Button>{" "}
          </div>
          <div className="rightButtons">
            <Button onClick={() => setOpenChat(!openChat)} startIcon={<FiMessageSquare size={20} />} />
          </div>
        </div>
      </div>
      {userId && chatId && openChat && (
        <div className="TextChat-container">
          <TextChat chat={chat} uid={fireUser.uid} userId={userId} chatId={chatId} />
        </div>
      )}
    </div>
  );
};

export default ChatView;
