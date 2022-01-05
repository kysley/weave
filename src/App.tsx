import { Link, Outlet, ReactLocation, Router, useMatch } from "react-location";

import { HostView } from "./components/host-view";
import { PeerView } from "./components/peer-view";
import { Home } from "./pages/home";

const location = new ReactLocation();

function App() {
  return (
    <Router
      location={location}
      routes={[
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "w",
          children: [
            {
              element: <PeerView />,
              path: ":code",
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
