import { useEffect } from "react";
import { WifiIcon } from "@heroicons/react/solid";

import { usePeer } from "../hooks/use-peer.hook";
import { useCreateWeaveCode } from "../hooks/use-weave-code.hook";
import { css } from "../stitches.config";
import { Box, Inlay, Stack } from "./box";
import { Loader } from "./loader";
import { Message } from "./message";
import { WeaveCode } from "./weave-code";

export function HostView() {
  const { conn, id, state } = usePeer();
  const { data: code, mutate, isLoading } = useCreateWeaveCode();

  useEffect(() => {
    if (!id) return;

    mutate(id);
  }, [id]);

  const handleChange = (e: any) => {
    if (conn) {
      console.log("hey");
      const firstFile = e.target.files[0];

      firstFile.arrayBuffer().then((buffer: any) => {
        const chunkSize = 16 + 2024;
        while (buffer.byteLength) {
          const chunk = buffer.slice(0, chunkSize);
          buffer = buffer.slice(chunkSize, buffer.byteLength);
          conn.send(chunk);
        }
        conn.send("EOF");
      });
    }
  };
  return (
    <>
      <Message title="Welcome to weave" type="success" />
      {/* <Loader /> */}
      <Stack>
        <Box css={{ width: "25vw" }}>
          <header className={headerStyle()}>
            {id ? (
              <span>
                you {"->"} {id}
              </span>
            ) : (
              <span>
                you {"->"} <Loader />
              </span>
            )}
          </header>
        </Box>
        <Box css={{ width: "25vw" }}>
          <WeaveCode code={code} />

          {/* <span>peer: {conn} </span> */}

          {/* <span>transfer: {transferStatus.toString()}</span>
      <div>
        {transferStatus === "DONE" ? (
          <button onClick={handleDownload} type="button">
            download
          </button>
        ) : (
          <span>Waiting for file...</span>
        )}
      </div> */}
        </Box>
        <Box>
          <WeaveActionBox />
          <input type="file" accept="image/*" onChange={handleChange} />
        </Box>
      </Stack>
    </>
  );
}

const WeaveActionBox = () => {
  const { state } = usePeer();
  return (
    <Inlay>
      <div>
        <span>
          <WifiIcon width={15} style={{ marginRight: "1em" }} />
          {state?.toLowerCase()}
        </span>
      </div>
    </Inlay>
  );
};

const headerStyle = css({
  display: "flex",
  alignItems: "center",
  span: {
    fontSize: ".785rem",
    fontStyle: "italic",
    marginRight: "1em",
  },
  h3: {
    fontSize: "1rem",
    fontStyle: "italic",
    marginRight: "1em",
    margin: "0",
  },
});
