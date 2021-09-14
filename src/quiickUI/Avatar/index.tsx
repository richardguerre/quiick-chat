import React from "react";

import "./Avatar.scss";
import { Props } from "./types";

const Avatar = ({ name, size = 100, avatarURL }: Props) => {
  const initials = name ? name.split(" ").map(w => w[0]) : "";

  const style = `
    .Avatar {
      --size: ${size}px;
      --font-ratio: ${initials.length};
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="Avatar">
        <span className="initials">{initials}</span>
        {avatarURL && avatarURL !== "" && <img src={avatarURL} alt="user's avatar" />}
      </div>
    </>
  );
};

export default Avatar;
