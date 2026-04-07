import { useState, useEffect, use } from "react";
import { DataProvider } from "./CommonJsx/DataContext.jsx";
import "./Styles/App.css";
import { supabase } from "./CommonJsx/SupabaseClient.js";
import LogInPage from "./CommonJsx/LogInPage.jsx";
import OwnerMainPage from "./OwnerJsx/OwnerMainPage.jsx";
import WorkerMainPage from "./WorkerJsx/WorkerMainPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export async function refreshOnlineStatus(id) {
  const date = new Date().toISOString();
  const { data, error } = await supabase
    .from("users")
    .update({ lastSeen: date })
    .eq("id", id);
}
function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <LogInPage />,
      errorElement: <div>404</div>,
    },
    {
      path: "/adminHome",
      element: <OwnerMainPage />,
    },
    {
      path: "/workerHome",
      element: <WorkerMainPage />,
    },
  ]);

  return (
    <DataProvider>
      <RouterProvider router={Router}></RouterProvider>
    </DataProvider>
  );
}

export default App;
