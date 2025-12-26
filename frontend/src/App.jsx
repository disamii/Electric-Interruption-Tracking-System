import React, { useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import InterputionDataForm from "./component/InterputionDataForm";
import ProtectedRoute from "./component/ProtectedRoute";
import Admin from "./pages/Admin";
import UserData from "./subRoutes/UserData";
import Dashboard from "./subRoutes/Dashboard";
import UserReg from "./subRoutes/UserReg";
import InterruptionDataTable from "./subRoutes/InterruptionDataTable";
import ExpressDetail from "./subRoutes/ExpressDetail";
import InterruptionSummary from "./subRoutes/InterruptionSummary";
import Unauthorized from "./pages/UnAuthorized";
import PageNotFound from "./pages/PageNotFound";
import UserDetail from "./subRoutes/UserDetail";
import Chat from "./subRoutes/Chat";
import Message from "./component/Message";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider } from "@material-tailwind/react";
import { BioGraphy } from "./component/Profile";
import Notification from "./component/adminComponent/Notification";
import Notes from "./component/adminComponent/Notes";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [theme, colorMode, themeSettings, mode] = useMode();
  const customTheme = useMemo(() => themeSettings(mode));

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={customTheme}>
      <Toaster/>
        <Routes>
          <Route index path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<ProtectedRoute role={"user"} />}>
            <Route
              index
              element={<Navigate to="interruption_form" replace />}
            />
            <Route element={<Home />}>
              <Route
                path="interruption_form"
                element={<InterputionDataForm />}
              />
              <Route
                path="user_uploads/:username"
                element={<InterruptionDataTable />}
              ></Route>
              <Route path="user_detail/:username" element={<UserDetail />} />
              <Route path="myprofile" element={<BioGraphy />} />
              <Route path="user_chat" element={<Message />} />
            </Route>
          </Route>

            <Route path="/admin" element={<ProtectedRoute role={"admin"} />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route element={<Admin />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route index path="dashboard" element={<Dashboard />} />
                <Route path="userData" element={<UserData />} />
                <Route path="user_detail/:username" element={<UserDetail />} />
                <Route path="userForm" element={<UserReg />} />
                <Route
                  path="interruptionDataTable"
                  element={<InterruptionDataTable />}
                />
                <Route
                  path="InterruptionExpressDataDetail/:express"
                  element={<ExpressDetail />}
                />
                <Route
                  path="InterruptionExpressDataSummary/"
                  element={<InterruptionSummary />}
                />
                <Route path="chat_system" element={<Chat />}>
                  <Route path="user_chat/:username" element={<Message />} />
                </Route>
                <Route path="myprofile" element={<BioGraphy />} />
                <Route path="notification" element={<Notification />} />
                <Route path="notes" element={<Notes />} />
              </Route>
            </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
