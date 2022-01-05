import {
  CloudDownloadIcon,
  CubeTransparentIcon,
  DocumentIcon,
  DownloadIcon,
  TagIcon,
  TicketIcon,
  UserIcon,
  WifiIcon,
} from "@heroicons/react/solid";
import { useMatch } from "react-location";
import { Box, Inlay, Loader } from ".";

import { useDownload, usePeer, usePeerConnection } from "../hooks";
import { useWeaveCode } from "../hooks/use-weave-code.hook";
import { css } from "../stitches.config";
import { Bone } from "./bone";

export function PeerView() {
  const { download } = useDownload();

  const match = useMatch();

  const { data: targetPeerId, isLoading } = useWeaveCode(match.params.code);
  const { id } = usePeer();
  const { fileBlob, state, transferStatus, fileMeta } = usePeerConnection(
    targetPeerId!
  );

  if (state !== "CONNECTED" || isLoading) {
    return (
      <div>
        <Bone />
      </div>
    );
  }

  const handleDownload = () => {
    if (!fileBlob.current) return;

    const blobUrl = URL.createObjectURL(fileBlob.current);
    download(blobUrl);
  };

  return (
    <Box>
      <Inlay>
        <h1 className={css({ color: "white" })()}>{match.params.code}</h1>
      </Inlay>
      <div>
        <UserIcon width={15} style={{ marginRight: "1em" }} />
        <span>{state.toLowerCase()}</span>
      </div>
      {!transferStatus && (
        <p>
          Waiting for file <Loader style="BOUNCE" />
        </p>
      )}
      {transferStatus && (
        <>
          <div>
            <WifiIcon width={15} style={{ marginRight: "1em" }} />
            <span>{transferStatus}</span>
          </div>
          <div>
            <DocumentIcon width={15} style={{ marginRight: "1em" }} />
            <span>{fileMeta?.name}</span>
          </div>
          <div>
            <CubeTransparentIcon width={15} style={{ marginRight: "1em" }} />
            <span>{fileMeta?.size}</span>
          </div>
          <div>
            <TagIcon width={15} style={{ marginRight: "1em" }} />
            <span>{fileMeta?.type}</span>
          </div>
        </>
      )}
      {transferStatus === "IN_PROGRESS" && (
        <div>
          <CloudDownloadIcon width={15} style={{ marginRight: "1em" }} />
          <span>{fileMeta?.progress}%</span>
        </div>
      )}
      {transferStatus === "DONE" && (
        <button onClick={handleDownload}>download</button>
      )}
    </Box>
  );
}
