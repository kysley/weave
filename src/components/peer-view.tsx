import { useMatch } from "react-location";

import { useDownload, usePeer, usePeerConnection } from "../hooks";
import { useWeaveCode } from "../hooks/use-weave-code.hook";
import { Bone } from "./bone";

export function PeerView() {
  const { download } = useDownload();

  const match = useMatch();

  const { data: targetPeerId, isLoading } = useWeaveCode(match.params.code);
  const { id } = usePeer();
  const { fileBlob, state, transferStatus } = usePeerConnection(targetPeerId!);

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
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className="peer-container"
    >
      <header className="peer-container__header">
        <span>
          you {"->"} {id}
        </span>
        <h3>{match.params.code}</h3>
      </header>
      <span>peer: {targetPeerId} </span>
      <span>state: {state}</span>
      <span>transfer: {transferStatus.toString()}</span>
      <div>
        {transferStatus === "DONE" ? (
          <button onClick={handleDownload} type="button">
            download
          </button>
        ) : (
          <span>Waiting for file...</span>
        )}
      </div>
    </div>
  );
}
