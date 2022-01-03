import { CSS } from "@stitches/react";
import { FC } from "react";
import { css, styled } from "../stitches.config";

export const Box: FC<{ css?: CSS }> = ({ children, css }) => (
  <div className={boxStyles({ css })}>{children}</div>
);

const boxStyles = css({
  boxShadow: "$primary",
  display: "flex",
  background: "#c0c0c0",
  borderRadius: "3px",
  padding: ".75em",
  flexDirection: "column",
});

export const Stack = styled("div", {
  boxSizing: "border-box",
  margin: 0,
  minWidth: 0,
  display: "flex",
  // flexDirection: direction,
  position: "relative",

  ":first-child": {
    marginTop: 0,
  },

  variants: {
    direction: {
      col: {
        flexDirection: "column",
        "> *": {
          marginTop: "1rem",
        },
      },
      row: {
        flexDirection: "row",
        "> *": {
          marginRight: "1rem",
        },
      },
    },
  },
  defaultVariants: {
    direction: "col",
  },
});

export const Inlay = styled("div", {
  padding: ".5em",
  boxShadow: "inset -1px -1px #dfdfdf,inset 1px 1px grey",
  // "inset -1px -1px #fff,inset 1px 1px grey,inset -2px -2px #dfdfdf,inset 2px 2px #0a0a0a",
});
