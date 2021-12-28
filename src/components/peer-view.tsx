import { useEffect, useRef, useState } from "react";
import { useMatch } from "react-location";

import { useDownload, usePeer } from "../hooks";

export function PeerView() {
  const { download } = useDownload();
  const { id, peer } = usePeer();

  const [connection, setConnectionState] = useState<boolean>(false);
  const [transferStatus, setTransferStatus] = useState<boolean | "DONE">(false);

  const chunks = useRef<string[]>([]);
  const fileBlob = useRef<Blob>();

  const match = useMatch();

  useEffect(() => {
    peer.on("open", (myId) => {
      const connection = peer.connect(match.params.id);

      connection.on("open", () => {
        setConnectionState(true);
        console.log("connection ready");
      });
      connection.on("data", function (data) {
        setTransferStatus(true);
        console.log(data);
        if (data.toString() === "EOF") {
          const file = new Blob(chunks.current, { type: "jpg" });
          fileBlob.current = file;
          setTransferStatus("DONE");
          return;
        }

        chunks.current.push(data);
      });
      connection.on("error", console.log);
    });
  }, []);

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
        <span>you: {id}</span>
      </header>
      <span>peer: {match.params.id} </span>
      <span>connected: {connection.toString()}</span>
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
