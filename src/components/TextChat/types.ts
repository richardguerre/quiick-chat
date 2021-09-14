import { Chat } from "utils/firestore";

export type Props = {
  chat: Chat;
  uid: string;
  userId: string;
  chatId: string;
};
