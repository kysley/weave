import { createStitches } from "@stitches/react";
import { darken, lighten } from "color2k";

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
      green200: lighten("green", 0.04),
    },
    shadows: {
      primary:
        "inset -1px -1px #0a0a0a,inset 1px 1px #dfdfdf,inset -2px -2px grey,inset 2px 2px #fff",
    },
  },
  media: {
    bp1: "(min-width: 640px)",
    bp2: "(min-width: 768px)",
    bp3: "(min-width: 1024px)",
  },
});
