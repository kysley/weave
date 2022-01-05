import { FC, useCallback, useRef, useState, VFC } from "react";
import { useNavigate, useRouter } from "react-location";
import { Box, HostView, Inlay, Loader, Message, Stack } from "../components";
import { usePeer } from "../hooks";
import { useIsFirefox } from "../hooks/use-is-firefox.hook";
import { useCreateWeaveCode } from "../hooks/use-weave-code.hook";
import { css } from "../stitches.config";

export const Home: FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const isFirefox = useIsFirefox();
  const { id } = usePeer();
  const { data: weaveCode, mutateAsync, isLoading } = useCreateWeaveCode();

  return (
    <>
      <Message title="Welcome to weave" type="success" />

      {isFirefox && (
        <Message
          title="It looks like you're using Firefox!"
          description="Firefox is giving me a hard time with TURN servers. Please use chrome :-("
          type="firefox"
        />
      )}
      {weaveCode ? (
        <HostView code={weaveCode} />
      ) : (
        <Stack>
          <Box css={{ marginTop: "1em" }}>
            <Stack css={{ alignItems: "center" }}>
              <h3>Connect to your other device:</h3>
              <Inlay>
                <input
                  className={inputStyles()}
                  placeholder="0000"
                  autoFocus
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Inlay>
              <button
                className={css({
                  width: "100%",
                  background: "$green",
                  transition: "all .14s ease-in",
                  cursor: "pointer",
                  height: "24px",
                  fontWeight: "bolder",
                  color: "white",
                  "&:hover": { background: "$green200", borderColor: "$green" },
                })()}
                onClick={() => navigate({ to: `w/${code}` })}
              >
                Connect
              </button>
              <h3>or</h3>
              <h2
                className={css({
                  margin: 0,
                  color: "$blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontStyle: "italic",
                })()}
                onClick={() => mutateAsync(id)}
              >
                Start a new weave session
                {isLoading && <Loader />}
              </h2>
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
};

const inputStyles = css({
  color: "black",
  outline: "none",
  border: "none",
  // borderBottom: "3px solid dimgray",
  background: "none",
  width: "200px",
  textAlign: "center",
  fontSize: "4rem",
});
