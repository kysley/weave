import { useEffect } from "react";
import { Link } from "react-location";

import { usePeer } from "../hooks/use-peer.hook";
import { useCreateWeaveCode } from "../hooks/use-weave-code.hook";
import { Bone } from "./bone";

export function HostView() {
  const { conn, id, state } = usePeer();
  const { data: code, mutate, isLoading } = useCreateWeaveCode();

  useEffect(() => {
    if (!id) return;

    mutate(id);
  }, [id]);

  if (!id || isLoading) {
    return (
      <div>
        <Bone />
      </div>
    );
  }

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
    <div className="peer-container">
      <header className="peer-container__header">
        <span>
          you {"->"} {id}
        </span>
      </header>
      <WeaveCode code={code!} />
      {/* <span>peer: {conn} </span> */}
      <span>state: {state}</span>
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
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}

function WeaveCode({ code }: { code: string }) {
  return (
    <div>
      <Link to={`/w/${code}`} target={"_blank"}>
        {`>>\ ${code}\ <<`}
      </Link>
    </div>
  );
}
