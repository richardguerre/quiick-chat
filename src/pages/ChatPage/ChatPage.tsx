import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import firebase from "firebase/app";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import Peer from "simple-peer";
import { useStore } from "react-hookstore";

import AskNameView from "./AskNameView/AskNameView";
import LeaveAMessageView from "./LeaveAMessageView/LeaveAMessageView";
import ChatView from "components/ChatView/ChatView";
import EndView from "./EndView/EndView";
import ErrorView from "./ErrorView/ErrorView";

import "./ChatPage.scss";
import { Params } from "./types";
import { UserProfile, FireUser, Chat, User } from "utils/types";
import WelcomeView from "./WelcomeView/WelcomeView";

const ChatPage = () => {
  const [fireUser, setFireUser] = useLocalStore<FireUser>("fireUser");
  const [user, setUser] = useSessionStore<User>("user");
  const [user2, setUser2] = useSessionStore<UserProfile>("user2");
  const [chat] = useSessionStore<Chat>("chat");
  const [, setLoading] = useStore<boolean>("loading");
  const [userDoesNotExist, setUserDoesNotExist] = useState(false);
  const [askInfo, setAskInfo] = useState(true);
  const [activeView, setActiveView] = useState<"WelcomeView" | "AskNameView" | "ChatView" | "LeaveAMessageView" | "EndView" | "ErrorView">(
    "WelcomeView"
  );
  const [peer, setPeer] = useState<Peer.Instance>();
  const [stream, setStream] = useState<MediaStream>();
  const [stream2, setStream2] = useState<MediaStream>();
  const [showVideo, setShowVideo] = useState(true);
  const [peerConnected, setPeerConnected] = useState(false);

  const { username }: Params = useParams();

  const handleStartChat = () => {
    if (user.name === "") return;
    if (user2.uid && fireUser?.uid) {
      window.navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then(s => {
          setStream(s);
          const p = new Peer({
            initiator: true,
            trickle: false,
            stream: s,
            reconnectTimer: 100,
            offerConstraints: {
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            },
            // @ts-ignore
            offerOptions: {
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            },
            // @ts-ignore
            iceTransportPolicy: "relay",
          });
          p.on("signal", (signal: any) => {
            if (!signal) console.error("Could not get offer signal");
            setPeer(p);
            // TODO: cleanup this part to either use async await or use a single chain of .then
            firebase
              .firestore()
              .doc(`users/${user2.uid}/chats/${fireUser.uid}`)
              .set({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                startedChatAt: firebase.firestore.FieldValue.serverTimestamp(),
                callerName: user.name,
                peerConnection: {
                  offer: signal,
                },
              } as Chat)
              .then(() => {
                setActiveView("ChatView");
              })
              .catch(err => console.error(err));
          });
          p.on("connect", () => {
            setPeerConnected(true);
          });
          p.on("stream", (s: MediaStream) => {
            setStream2(s);
          });
          p.on("data", (data: Peer.SimplePeerData) => {
            const message = data.toString();
            switch (message) {
              case "show video":
                setShowVideo(true);
                break;
              case "don't show video":
                setShowVideo(false);
                break;
            }
          });
          p.on("close", () => {
            setActiveView("EndView");
            stream?.removeTrack(stream.getVideoTracks()[0]);
            stream?.removeTrack(stream.getAudioTracks()[0]);
            stream?.getTracks().forEach(track => {
              if (track.readyState === "live") {
                track.stop();
              }
            });
          });
          p.on("error", (err: any) => {
            setActiveView("ErrorView");
            console.error(err);
          });
        })
        .catch(err => console.error(err));
    } else {
      // TODO: Show error message
    }
  };

  const handleShowVideo = (state: boolean) => {
    if (peer && peerConnected) {
      if (state) peer.send("show video");
      else peer.send("don't show video");
    }
  };

  const handleHangup = () => {
    if (peer) {
      peer.destroy();
    }
  };

  useEffect(() => {
    const toCancel = firebase.auth().onAuthStateChanged(fireUser => {
      if (fireUser && !fireUser.isAnonymous) {
        setFireUser(fireUser);
        // fireUser.photoURL && setAvatarURL(fireUser.photoURL);
        firebase
          .firestore()
          .doc(`users/${fireUser.uid}`)
          .get()
          .then(doc => {
            if (!doc.exists) {
              setAskInfo(true);
            } else {
              const data = doc.data() as User;
              setUser(data);
              setAskInfo(false);
            }
            firebase
              .firestore()
              .collection("users")
              .where("username", "==", username)
              .limit(1)
              .onSnapshot(snap => {
                if (snap.empty) {
                  setUserDoesNotExist(true);
                  setLoading(false);
                } else {
                  const data = snap.docs[0].data() as User;
                  setUser2({ ...data, uid: snap.docs[0].id });
                  setLoading(false);
                }
              });
          })
          .catch(err => console.error(err));
      } else if (!fireUser) {
        firebase
          .auth()
          .signInAnonymously()
          .then(authUser => {
            setFireUser(authUser.user);
            firebase
              .firestore()
              .collection("users")
              .where("username", "==", username)
              .limit(1)
              .onSnapshot(snap => {
                if (snap.empty) {
                  setUserDoesNotExist(true);
                  setLoading(false);
                } else {
                  const data = snap.docs[0].data() as User;
                  setUser2({ ...data, uid: snap.docs[0].id });
                  setLoading(false);
                }
              });
          })
          .catch(err => console.error(err));
        setAskInfo(true);
      } else {
        setLoading(false);
      }
    });

    return () => toCancel();
    // eslint-disable-next-line
  }, [username]);

  useEffect(() => {
    if (chat.peerConnection?.answer && peer) {
      peer.signal(chat.peerConnection.answer);
    }
  }, [peer, chat]);

  if (userDoesNotExist) {
    return (
      <div className="ChatPage">
        <div className="userNotFound">
          <h2>Uh oh...</h2>
          <p>The user you are trying to reach could not be found.</p>
          <sub>The URL you entered may be incorrect or the user may have changed their URL.</sub>
        </div>
      </div>
    );
  }

  if (!fireUser) return <></>;

  return (
    <div className="ChatPage">
      {activeView === "WelcomeView" && (
        <WelcomeView onLetsChat={() => setActiveView("AskNameView")} onLeaveAMessage={() => setActiveView("LeaveAMessageView")} />
      )}
      {activeView === "AskNameView" && <AskNameView askInfo={askInfo} onStartChat={handleStartChat} />}
      {activeView === "ChatView" && user2.uid && (
        <ChatView
          userId={user2.uid}
          chatId={fireUser.uid}
          showVideo2={showVideo}
          onToggleVideo={handleShowVideo}
          onHangup={handleHangup}
          connected={peerConnected}
          stream={stream}
          stream2={stream2}
          defaultOpenChat
        />
      )}
      {activeView === "LeaveAMessageView" && <LeaveAMessageView />}
      {activeView === "EndView" && <EndView />}
      {activeView === "ErrorView" && <ErrorView onCallAgain={handleStartChat} onLeaveAMessage={() => setActiveView("LeaveAMessageView")} />}
    </div>
  );
};

export default withRouter(ChatPage);
