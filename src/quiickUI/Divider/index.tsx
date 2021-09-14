import React from "react";

import { Props } from "./types";
import "./Divider.scss";

const Divider = ({ vertical }: Props) => {
  return <hr className={`Divider ${vertical ? "vertical" : ""}`} />;
};

export default Divider;
