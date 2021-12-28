import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { Link, Outlet, ReactLocation, Router, useMatch } from "react-location";
import ky from "ky";
import { HostView } from "./components/host-view";
import { PeerView } from "./components/peer-view";

const location = new ReactLocation();

function App() {
  return (
    <Router
      location={location}
      routes={[
        {
          path: "/",
          element: <HostView />,
        },
        {
          path: "p",
          children: [
            {
              element: <PeerView />,
              path: ":id",
              loader: async ({ params: { id } }) =>
                ky
                  .get("localhost:3001/peermanager", { json: { peerId: id } })
                  .json(),
            },
          ],
        },
      ]}
    >
      <div className="container">
        <Outlet />
      </div>
    </Router>
  );
}

export default App;
