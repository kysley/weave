import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { QueryClientProvider, QueryClient } from "react-query";
import { PeerProvider } from "./hooks";

const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <PeerProvider>
        <App />
      </PeerProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
