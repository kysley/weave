import Peer from "peerjs";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

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

export const PeerContext = createContext<{
  peer: Peer;
  id?: string;
  conn?: Peer.DataConnection;
  state?: ConnectionStatusState;
}>({ peer: peerSingleton });

type ConnectionStatusState = "CONNECTED" | "CONNECTING" | "DISCONNECTED";

export const PeerProvider: FC = ({ children }) => {
  const { peer } = useContext(PeerContext);
  const [id, setId] = useState<string>();
  const [conn, setConn] = useState<Peer.DataConnection>();
  const [state, setConnectionState] =
    useState<ConnectionStatusState>("DISCONNECTED");

  useEffect(() => {
    peer.on("open", (id) => setId(id));
    peer.on("error", console.log);
    peer.on("connection", function (conn) {
      setConnectionState("CONNECTING");
      console.log("hey");
      setConn(conn);
      conn.on("error", () => setConnectionState("DISCONNECTED"));
      conn.on("open", () => setConnectionState("CONNECTED"));
    });
  }, []);

  const value = { id, conn, peer, state };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
};

export const usePeerConnection = (peerId: string) => {
  const { id, peer, conn } = usePeer();

  const [state, setConnectionState] =
    useState<ConnectionStatusState>("DISCONNECTED");
  const [transferStatus, setTransferStatus] = useState<
    "IN_PROGRESS" | "PENDING" | "DONE"
  >();
  const [fileMeta, setFileMeta] = useState<{
    name: string;
    type: string;
    size: number;
    chunks: number;
    progress?: number;
  }>({ name: "", type: "", size: 0, chunks: 0 });

  const chunks = useRef<string[]>([]);
  const fileBlob = useRef<Blob>();

  useEffect(() => {
    if (peerId && id) {
      const connection = peer.connect(peerId);
      setConnectionState("CONNECTING");
      connection.on("open", () => setConnectionState("CONNECTED"));
      connection.on("close", () => setConnectionState("DISCONNECTED"));
      connection.on("error", () => setConnectionState("DISCONNECTED"));
      connection.on("data", function (data) {
        let thisType;
        if (data.type === "EOF") {
          const file = new Blob(chunks.current, { type: thisType });
          fileBlob.current = file;
          setTransferStatus("DONE");
          thisType = undefined;
          chunks.current = [];
        } else if (data.type === "METADATA") {
          setTransferStatus("PENDING");
          thisType = data.payload.type;
          setFileMeta(data.payload);
        } else if (data.type === "CHUNK") {
          setTransferStatus("IN_PROGRESS");
          chunks.current.push(data.payload.chunk);
          setFileMeta((prev) => ({
            ...prev,
            progress: (prev.chunks / data.payload.chunkNum) * 100,
          }));
        }
      });
    }
  }, [peerId, id, conn]);

  return { state, transferStatus, fileBlob, fileMeta };
};

export const usePeer = () => {
  return useContext(PeerContext);
};
