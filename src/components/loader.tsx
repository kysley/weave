import { FC, useState } from "react";
import { useInterval } from "../hooks";
import { css } from "../stitches.config";

const STEPS = ["-", "\\", "|", "/"];

//@todo maybe a reverse prop
const BOUNCE = [
  "[===]",
  "[-==]",
  "[=-=]",
  "[==-]",
  "[===]",
  "[==-]",
  "[=-=]",
  "[-==]",
];

const EFFECTS = {
  STEPS,
  BOUNCE,
};

export const Loader: FC<{ style?: keyof typeof EFFECTS }> = ({
  style = "STEPS",
}) => {
  const [step, setStep] = useState(0);
  useInterval(() => {
    if (step < EFFECTS[style].length - 1) {
      setStep((prev) => (prev += 1));
    } else {
      setStep(0);
    }
  }, 600);

  return <span className={containerStyles()}>{EFFECTS[style][step]}</span>;
};

const containerStyles = css({
  fontFamily: "monospace",
  fontSize: "16px",
});
