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
  const [transferStatus, setTransferStatus] = useState<boolean | "DONE">(false);

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
        setTransferStatus(true);
        if (data.toString() === "EOF") {
          const file = new Blob(chunks.current, { type: "jpg" });
          fileBlob.current = file;
          setTransferStatus("DONE");
          return;
        }

        chunks.current.push(data);
      });
    }
  }, [peerId, id, conn]);

  return { state, transferStatus, fileBlob };
};

export const usePeer = () => {
  return useContext(PeerContext);
};
