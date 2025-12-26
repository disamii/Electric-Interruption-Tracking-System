import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import RouteContextProvider from "./context/RouteContext.jsx";
import { CustomThemeProvider } from "./context/ThemeContext.jsx";
import DashboardProvider from "./context/DashboardContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const queryclient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryclient}>
    <ReactQueryDevtools />
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <ThemeProvider>
              <RouteContextProvider>
                <App />
              </RouteContextProvider>
            </ThemeProvider>
          </DashboardProvider>
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
