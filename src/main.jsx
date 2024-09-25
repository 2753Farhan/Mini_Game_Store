import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Snake from "./games/snake";
import App from "./App";
import Platformer from "./games/Platformer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/snake",
    element: <Snake/>,
  },
  {
    path: "/platformer",
    element: <Platformer/>,
  },
  // {
  //   path: "/",
  //   element: <App/>,
  // },
  // {
  //   path: "/",
  //   element: <App/>,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);