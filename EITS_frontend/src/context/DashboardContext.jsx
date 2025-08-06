import React, { createContext, useContext, useState } from "react";

const dashboardContext = createContext(null);

export default function DashboardProvider({ children }) {
    const [userState, setUserState] = useState({
        totalUser: 0,
        suspendedUser: 0
    });

    return (
        <dashboardContext.Provider value={{ setUserState, userState }}>
            {children}
        </dashboardContext.Provider>
    );
}
export function useDashboard() {
    const context = useContext(dashboardContext);
    if (context === null) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
