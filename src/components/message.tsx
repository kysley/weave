import React, { FC } from "react";

import { css } from "../stitches.config";

type MessageType = "success" | "warning" | "error" | "default" | "firefox";

type MessageProps = {
  title: string;
  description?: string;
  type?: MessageType;
};
export const Message: FC<MessageProps> = ({
  title,
  description,
  type = "default",
}) => (
  <div className={containerStyles({ type })}>
    <h4 className={titleStyle({})}>{title}</h4>
    {description && <p>{description}</p>}
  </div>
);

const containerStyles = css({
  // boxShadow: "$primary",
  background: "#c0c0c0",
  padding: ".25em 1em",
  boxShadow: "#4d4c4c 4px 7px 6px",
  marginBottom: "1em",

  p: {
    margin: ".19em 0",
  },

  variants: {
    type: {
      default: {
        border: "$blue 1px double",
      },
      firefox: {
        border: "$orange 1px solid",
      },
      success: {
        border: "$green 6px double",
      },
      warning: {
        border: "$yellow 2px solid",
      },
      error: {
        border: "$red 3px solid",
      },
    },
  },
});

const titleStyle = css({
  fontSize: "1.26em",
  color: "black",
  fontWeight: "normal",
  margin: 0,
});
