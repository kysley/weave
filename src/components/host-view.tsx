import { useEffect, useState } from "react";
import Peer from "peerjs";
import { Link } from "react-location";

import { usePeer } from "../hooks/use-peer.hook";

export function HostView() {
  const { connection, id } = usePeer();

  const handleChange = (e: any) => {
    if (connection) {
      console.log("hey");
      const firstFile = e.target.files[0];

      firstFile.arrayBuffer().then((buffer: any) => {
        const chunkSize = 16 + 2024;
        while (buffer.byteLength) {
          const chunk = buffer.slice(0, chunkSize);
          buffer = buffer.slice(chunkSize, buffer.byteLength);
          connection.send(chunk);
        }
        connection.send("EOF");
      });

      // conn.send({
      //   file: new Blob(e.target.files, { type: file.type }),
      //   name: file.name,
      //   type: file.type,
      // });
    }
  };
  return (
    <div className="peer-container">
      <header className="peer-container__header">
        <span>me</span>
        {/* <Link to={`/p/${id}`}>{id}</Link> */}
        <span>{id}</span>
      </header>
      <input type="file" accept="image/*" onChange={handleChange} />
    </div>
  );
}
