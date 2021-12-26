import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { Link, Outlet, ReactLocation, Router, useMatch } from "react-location";

const location = new ReactLocation();

const peer = new Peer(undefined, {
  // host: "localhost",
  // port: 9000,
  // path: "/myapp",
  // host: "0.peerjs.com",
  config: {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  },
});
import "./App.css";

function Index({}) {
  const [id, setId] = useState<string>();
  const [conn, setConn] = useState<Peer.DataConnection>();

  useEffect(() => {
    peer.on("open", (id) => setId(id));
    peer.on("error", console.log);
    peer.on("call", (cb) => cb.answer());
    peer.on("connection", function (conn) {
      console.log("hey");
      setConn(conn);
      conn.on("error", console.log);
    });
  }, []);

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

      // conn.send({
      //   file: new Blob(e.target.files, { type: file.type }),
      //   name: file.name,
      //   type: file.type,
      // });
    }
  };
  return (
    <>
      <Link to={`/p/${id}`}>{id}</Link>
      <input type="file" accept="image/*" onChange={handleChange} />
    </>
  );
}

function PeerView() {
  const [id, setId] = useState<string>();
  const [connection, setConnectionState] = useState<boolean>(false);
  const [transferStatus, setTransferStatus] = useState<boolean | "DONE">(false);

  const chunks = useRef<string[]>([]);
  const fileBlob = useRef<Blob>();

  const match = useMatch();
  useEffect(() => {
    peer.on("error", console.log);
    peer.on("open", (myId) => {
      setId(myId);
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

  const download = () => {
    if (!fileBlob.current) return;

    const blobUrl = URL.createObjectURL(fileBlob.current);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `weave-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: false,
        cancelable: true,
        view: window,
      })
    );
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>you: {id}</span>
      <span>peer: {match.params.id} </span>
      <span>connected: {connection.toString()}</span>
      <span>transfer: {transferStatus.toString()}</span>
      <div>
        {transferStatus === "DONE" ? (
          <button onClick={download} type="button">
            download
          </button>
        ) : (
          <span>Waiting for file...</span>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router
      location={location}
      routes={[
        {
          path: "/",
          element: <Index />,
        },
        {
          path: "p",
          children: [
            {
              element: <PeerView />,
              path: ":id",
            },
          ],
        },
      ]}
    >
      <Outlet />
    </Router>
  );
}

export default App;
