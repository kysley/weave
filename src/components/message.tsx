import { FC } from "react";

import { css } from "../stitches.config";

type MessageType = "success" | "warning" | "error" | "default";

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
  <div className={containerStyles({ type: "default" })}>
    <h2 className={titleStyle({})}>{title}</h2>
    {description && <p>{description}</p>}
  </div>
);

const containerStyles = css({
  // boxShadow: "$primary",
  background: "#c0c0c0",
  padding: ".25em 1em",
  marginBottom: "1em",

  variants: {
    type: {
      default: {
        border: "$blue 1px double",
        boxShadow: "0 0 0 1px blue, #4d4c4c 4px 7px 6px",
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
