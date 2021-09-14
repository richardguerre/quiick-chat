import { UserProfile } from "utils/types";

type Links = "username" | "welcomeMessage" | "presence" | "socialLinks";

export type Props = {
  user: UserProfile;
  dontShow?: Links[];
  canEdit?: boolean;
};
