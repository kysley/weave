import { createStitches } from "@stitches/react";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      gray400: "gainsboro",
      gray500: "lightgray",
      red: "red",
      orange: "orange",
      yellow: "yellow",
      blue: "blue",
      green: "green",
    },
    shadows: {
      primary:
        "inset -1px -1px #0a0a0a,inset 1px 1px #dfdfdf,inset -2px -2px grey,inset 2px 2px #fff",
    },
  },
  media: {
    bp1: "(min-width: 480px)",
  },
});
