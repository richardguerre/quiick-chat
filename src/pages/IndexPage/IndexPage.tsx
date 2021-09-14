import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Button, TextField } from "quiickUI";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import firebase from "firebase/app";
import { PulseLoader } from "react-spinners";
import { FiPhone } from "react-icons/fi";
import FadeIn from "react-fade-in";
import Peer from "simple-peer";
import { useForm } from "react-hook-form";
import { generate } from "shortid";

import ChatView from "components/ChatView/ChatView";
import ProfileOverview from "components/ProfileOverview/ProfileOverview";
import CopyLink from "components/CopyLink/CopyLink";

import "./IndexPage.scss";
import { FireUser, User, Chat, UserProfile, TextChat } from "utils/types";
import { allowNotifications, notify } from "utils";
import ErrorView from "./ErrorView/ErrorView";

const IndexPage = () => {
  const [fireUser, setFireUser] = useLocalStore<FireUser>("fireUser");
  const [turnedOnNotifications, setTurnedOnNotifications] = useLocalStore<boolean>("turnedOnNotifications");
  const [createdProfile] = useLocalStore<boolean>("createdProfile");
  const [user] = useSessionStore<User>("user");
  const [user2, setUser2] = useSessionStore<UserProfile>("user2");
  const [chat, setChat] = useSessionStore<Chat>("chat");
  const [callPending, setCallPending] = useState(false);
  const [activeView, setActiveView] = useState<"WaitingView" | "ChatView" | "EndView" | "ErrorView">("WaitingView");
  const [peer, setPeer] = useState<Peer.Instance>();
  const [stream, setStream] = useState<MediaStream>();
  const [stream2, setStream2] = useState<MediaStream>();
  const [showVideo, setShowVideo] = useState(true);
  const [sayWhy, setSayWhy] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);

  const { register, handleSubmit } = useForm();

  const handleSignOut = async () => {
    const fireUser = firebase.auth().currentUser;
    if (fireUser) {
      firebase
        .firestore()
        .doc(`users/${fireUser.uid}`)
        .update({
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastOnlineAt: firebase.firestore.FieldValue.serverTimestamp(),
          presence: "offline",
        } as User)
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          setFireUser(null);
          sessionStorage.clear();
        })
        .catch(err => console.error(err));
    }
  };

  const handlePeerConnection = () => {
    if (chat.peerConnection?.offer && fireUser?.uid && user2.uid) {
      window.navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then(s => {
          setStream(s);
          const p = new Peer({
            initiator: false,
            trickle: false,
            stream: s,
            reconnectTimer: 100,
            answerConstraints: {
              offerToReceiveAudio: false,
              offerToReceiveVideo: false,
            },
            // @ts-ignore
            answerOptions: {
              offerToReceiveAudio: false,
              offerToReceiveVideo: false,
            },
            // @ts-ignore
            iceTransportPolicy: "relay",
          });
          if (chat.peerConnection) p.signal(chat.peerConnection.offer);
          p.on("signal", (signal: any) => {
            if (!signal) console.error("Could not respond with answer signal");
            setPeer(p);
            // FIXME: Change this to transaction to make sure that final document update has both offer and answer (this is why there is currently a notification triggered when accepting call)
            firebase
              .firestore()
              .doc(`users/${fireUser.uid}/chats/${user2.uid}`)
              .update({
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                peerConnection: {
                  offer: chat.peerConnection?.offer,
                  answer: signal,
                },
              } as Chat)
              .then(() => {})
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
            stream?.getTracks().forEach(track => {
              if (track.readyState === "live") {
                track.stop();
              }
            });
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          });
          p.on("error", (err: any) => {
            console.error(err);
          });
        })
        .catch(err => console.error(err));
    } else {
      // TODO: Show error message
    }
  };

  const handleAccept = () => {
    setActiveView("ChatView");
    setCallPending(false);
    handlePeerConnection();
  };

  const handleDecline = (values: Record<string, any>) => {
    const reason = values.reason;
    if (fireUser && user2.uid) {
      firebase
        .firestore()
        .doc(`users/${fireUser.uid}/chats/${user2.uid}`)
        .update({
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          textChat: firebase.firestore.FieldValue.arrayUnion({
            id: generate(),
            uid: fireUser.uid,
            message: reason,
          } as TextChat),
        })
        .then(() => {
          window.location.reload();
        })
        .catch(err => console.error(err));
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

  const handleAllowNotifications = () => {
    allowNotifications()
      .then(v => setTurnedOnNotifications(true))
      .catch(err => {
        console.error(err);
        // TODO: Show error notification
        setTurnedOnNotifications(false);
      });
  };

  useEffect(() => {
    if (fireUser?.uid) {
      const now = new Date();
      const toCancel = firebase
        .firestore()
        .collection(`users/${fireUser.uid}/chats`)
        .where("startedChatAt", ">=", now)
        .orderBy("startedChatAt")
        .limit(1)
        .onSnapshot(querySnap => {
          if (!querySnap.empty) {
            const doc = querySnap.docs[0];
            const data = doc.data() as Chat;
            if (data.textChat && data.textChat[data.textChat.length - 1].uid !== fireUser.uid && !data.peerConnection?.answer) {
              notify(data.textChat[data.textChat.length - 1].message, { subtitle: `Says ${data.callerName}`, ignoreFocus: true });
            } else if (!data.peerConnection?.answer && !peerConnected) {
              notify(`${data.callerName} wants to chat!`, { requireInteraction: true });
            }
            setUser2({ name: data.callerName, uid: doc.id });
            setChat(data);
            setCallPending(true);
          } else {
            setCallPending(false);
          }
        });

      return () => toCancel();
    }
    // eslint-disable-next-line
  }, [fireUser]);

  if (!fireUser || !createdProfile) return <Redirect to="/signup" />;

  return (
    <div className="IndexPage">
      {!callPending && (
        <Button className="signout" variant="tertiary" onClick={handleSignOut}>
          Sign out
        </Button>
      )}
      {activeView === "WaitingView" && (
        <div className="WaitingView">
          <div className="center-container">
            {callPending && (
              <>
                <ProfileOverview
                  user={{
                    name: chat?.callerName || "",
                  }}
                  dontShow={["username", "welcomeMessage", "presence"]}
                />
                <div className="callPending">
                  <PulseLoader color="var(--brand-primary0)" margin={20} size={20} />
                  <FadeIn className="callActions">
                    <div className="declineButton">
                      <Button
                        onClick={() => setSayWhy(true)}
                        startIcon={<FiPhone size={24} style={{ transform: "rotate(135deg)" }} />}
                        variant="destruct"
                      ></Button>
                      {sayWhy && (
                        <form onSubmit={handleSubmit(handleDecline)}>
                          <FadeIn className="sayWhy">
                            <TextField name="reason" placeholder="Why are you declining?" required autoFocus ref={register} />
                            <Button type="submit">Send</Button>
                          </FadeIn>
                        </form>
                      )}
                    </div>
                    <Button onClick={handleAccept} startIcon={<FiPhone size={24} />}></Button>
                  </FadeIn>
                </div>
              </>
            )}
            <ProfileOverview user={user} canEdit />
          </div>
          <footer>
            {!turnedOnNotifications ? (
              "Notification" in window ? (
                <div className="allow-notifications">
                  <sub>Get notified whenever someone wants to chat with you.</sub>
                  <Button onClick={handleAllowNotifications}>Allow Notifications</Button>
                </div>
              ) : (
                <sub>Your browser does not support notifications. Please try on a different browser or device.</sub>
              )
            ) : (
              <div className="turned-on-notifications">
                <sub>Notifications are on!</sub>
              </div>
            )}
            <div className="share-link">
              {/* <sub>Share your link</sub> */}
              <CopyLink link={`quiick.chat/w/${user.username}`} />
            </div>
          </footer>
        </div>
      )}
      {activeView === "ChatView" && user2.uid && (
        <ChatView
          userId={fireUser.uid}
          chatId={user2.uid}
          showVideo2={showVideo}
          onToggleVideo={handleShowVideo}
          onHangup={handleHangup}
          connected={peerConnected}
          stream={stream}
          stream2={stream2}
          dontListen
        />
      )}
      {activeView === "EndView" && (
        <div className="EndView">
          <FadeIn className="centerContainer">
            <h3>The call has ended.</h3>
            <p>You will be redirected back home in 5 seconds.</p>
          </FadeIn>
        </div>
      )}
      {activeView === "ErrorView" && <ErrorView />}
    </div>
  );
};

export default IndexPage;
