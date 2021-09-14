import Peer from "simple-peer";

export type Props = {
  userId: string;
  chatId: string;
  showVideo2: boolean;
  onToggleVideo: (state: boolean) => void;
  onHangup: () => void;
  connected: boolean;
  stream?: MediaStream;
  stream2?: MediaStream;
  dontListen?: boolean;
  defaultOpenChat?: boolean;
};
