import React, { useEffect, useRef, useState } from "react";
import { UserIcon, WifiIcon } from "@heroicons/react/solid";

import { usePeer } from "../hooks/use-peer.hook";
import { useCreateWeaveCode } from "../hooks/use-weave-code.hook";
import { css } from "../stitches.config";
import { Box, Inlay, Stack } from "./box";
import { Loader } from "./loader";
import { Message } from "./message";
import { WeaveCode } from "./weave-code";

const CHUNK_SIZE = 16 + 2024;

export function HostView({ code }: { code: string }) {
  const { conn, id } = usePeer();
  const stagedFileRef = useRef<File>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (conn) {
      if (!e.target.files) return;
      const firstFile = e.target.files[0];

      stagedFileRef.current = firstFile;

      conn.send({
        type: "METADATA",
        payload: {
          size: firstFile.size,
          type: firstFile.type,
          name: firstFile.name,
          chunks: firstFile.size / CHUNK_SIZE,
        },
      });
    }
  };

  const handleSend = () => {
    if (!stagedFileRef.current || !conn) return;

    stagedFileRef.current.arrayBuffer().then((buffer: any) => {
      let chunkNum = 1;
      while (buffer.byteLength) {
        const chunk = buffer.slice(0, CHUNK_SIZE);
        buffer = buffer.slice(CHUNK_SIZE, buffer.byteLength);
        conn.send({ type: "CHUNK", payload: { chunk, chunkNum } });
        chunkNum++;
      }
      conn.send({ type: "EOF" });
    });
  };
  return (
    <>
      <Stack>
        <Box>
          <WeaveCode code={code} />
        </Box>
        <Box>
          <WeaveActionBox />
          <input type="file" accept="image/*" onChange={handleChange} />
          <span onClick={handleSend}>send</span>
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
          <UserIcon width={15} style={{ marginRight: "1em" }} />
          {state?.toLowerCase()}
        </span>
      </div>
    </Inlay>
  );
};
