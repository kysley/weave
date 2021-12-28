import Peer from "peerjs";
import { createContext, useContext, useEffect, useState } from "react";

const peerSingleton = new Peer(undefined, {
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

export const peerContext = createContext(peerSingleton);

export const usePeer = () => {
  const peer = useContext(peerContext);
  const [id, setId] = useState<string>();
  const [conn, setConn] = useState<Peer.DataConnection>();

  useEffect(() => {
    peer.on("open", (id) => setId(id));
    peer.on("error", console.log);
    peer.on("call", (cb) => cb.answer());
    peer.on("connection", function (conn) {
      console.log("usePeer - connection");
      setConn(conn);
      conn.on("error", console.log);
      conn.on("open", console.log);
    });
  }, []);

  return {
    id,
    peer,
    connection: conn,
  };
};
