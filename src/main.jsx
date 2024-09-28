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
import Bubble_Popper from "./games/Bubble_Popper";

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
  {
    path: "/bubble_popper",
    element: <Bubble_Popper/>,
  },
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