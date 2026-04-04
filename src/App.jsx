import { useState, useEffect, use } from "react";
import { DataContext, DataProvider } from "./CommonJsx/DataContext.jsx";
import "./Styles/App.css";
import LogInPage from "./CommonJsx/LogInPage.jsx";
import OwnerMainPage from "./OwnerJsx/OwnerMainPage.jsx";
import WorkerMainPage from "./WorkerJsx/WorkerMainPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddOrderForm from "./CommonJsx/AddOrderForm.jsx";
import AddWorker from "./CommonJsx/AddWorker.jsx";

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
