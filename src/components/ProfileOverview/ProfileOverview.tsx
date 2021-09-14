import React from "react";
import FadeIn from "react-fade-in";
import { Avatar } from "quiickUI";
import { FiLinkedin, FiTwitter, FiInstagram, FiLink } from "react-icons/fi";

import EditProfileView from "./EditProfileView/EditProfileView";

import "./ProfileOverview.scss";
import { Props } from "./types";

function ProfileOverview({ user, dontShow, canEdit }: Props) {
  const name = user.name !== "" ? user.name : "Quiick Chat";
  const socialLinks = user.socialLinks || {};
  const socialLinkKeys = Object.keys(socialLinks);

  return (
    <FadeIn className="ProfileOverview">
      <Avatar name={name} avatarURL={user.avatar?.URL} />
      <h3>{name}</h3>
      <div className="usernamePresence">
        {!dontShow?.includes("username") && user.username && user.username !== "" && <sub>@{user.username}</sub>}
        {!dontShow?.includes("presence") && user.presence && (
          <div className="presence">
            <svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="4.5" r="4.5" fill={user.presence === "online" ? "var(--denotive-success)" : "var(--denotive-error)"} />
            </svg>
            <p>{user.presence}</p>
          </div>
        )}
      </div>
      {!dontShow?.includes("socialLinks") && (
        <div className="socialLinks">
          {socialLinkKeys.map(key => {
            if (key === "linkedIn" && socialLinks.linkedIn !== "") {
              return (
                <a key="linkedIn" href={socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                  <FiLinkedin />
                </a>
              );
            } else if (key === "twitter" && socialLinks.twitter !== "") {
              return (
                <a key="twitter" href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FiTwitter />
                </a>
              );
            } else if (key === "instagram" && socialLinks.instagram !== "") {
              return (
                <a key="instagram" href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <FiInstagram />
                </a>
              );
            } else if (key === "other" && socialLinks.other?.every(l => l !== "")) {
              return (
                <a key="other" href={(socialLinks.other || [])[0]} target="_blank" rel="noopener noreferrer">
                  <FiLink />
                </a>
              );
            } else return <></>;
          })}
        </div>
      )}
      {!dontShow?.includes("welcomeMessage") && user.welcomeMessage && user.welcomeMessage !== "" && (
        <p className="welcomeMessage">{user.welcomeMessage}</p>
      )}
      {canEdit && <EditProfileView />}
    </FadeIn>
  );
}

export default ProfileOverview;
