import React, { useState } from "react";
import { Button, TextField } from "quiickUI";

import "./CopyLink.scss";
import { Props } from "./types";

const CopyLink = ({ link }: Props) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const copyText = document.getElementById("link-to-copy");
    // @ts-ignore
    copyText.select();
    // @ts-ignore
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="CopyLink">
      <TextField id="link-to-copy" value={link} spellCheck={false} readOnly />
      <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
    </div>
  );
};

export default CopyLink;
