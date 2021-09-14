import React from "react";

import "./Message.scss";
import { Props } from "./types";

const Message = ({ text, sender }: Props) => {
  return <div className={`Message ${sender ? "sender" : ""}`}>{text}</div>;
};

export default Message;
