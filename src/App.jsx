import { useState, useEffect, use } from "react";
import { DataProvider } from "./CommonJsx/DataContext.jsx";
import "./Styles/App.css";
import { supabase } from "./CommonJsx/SupabaseClient.js";
import LogInPage from "./CommonJsx/LogInPage.jsx";
import MainPage from "./CommonJsx/MainMenu/MainPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <LogInPage />,
      errorElement: <div>404</div>,
    },
    {
      path: "/Home",
      element: <MainPage />,
    },
   
  ]);

  return (
    <DataProvider>
      <RouterProvider router={Router}></RouterProvider>
    </DataProvider>
  );
}

export default App;
