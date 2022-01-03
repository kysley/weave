import { Link } from "react-location";

import { css } from "../stitches.config";
import { Box, Inlay } from "./box";
import { Loader } from "./loader";

export const WeaveCode = ({ code }: { code?: string }) => {
  return (
    <Inlay className={weaveCodeStyle()}>
      <Box
        css={{
          boxShadow: "none",
          padding: 0,
          alignItems: "center",
          flexShrink: 1,
        }}
      >
        <span>Your weave code:</span>
        {code ? (
          <Link to={`/w/${code}`} target={"_blank"}>
            {code}
          </Link>
        ) : (
          <Loader style="BOUNCE" />
        )}
        <span>Enter this code on your other device.</span>
      </Box>
    </Inlay>
  );
};

const weaveCodeStyle = css({
  a: {
    color: "$green",
    fontWeight: "bold",
    fontSize: "2rem",
  },
});
