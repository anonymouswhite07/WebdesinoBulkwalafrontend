import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppInitializer from "./components/layout/AppInitializer";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <AppInitializer>
    <RouterProvider router={App} />
  </AppInitializer>
);
