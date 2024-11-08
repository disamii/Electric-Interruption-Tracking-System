import { createContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider } from "@material-tailwind/react";
// import { useAuth } from "./AuthContext";
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const { logout } = useAuth();
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return savedMode ? savedMode : "light";  // Default to light mode
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme-mode", newMode);  // Save theme to localStorage
          return newMode;
        });
      },
    }),
    []
  );

  // useEffect(() => {
  //   if (logout) {
  //     setMode("light");
  //     localStorage.removeItem("theme-mode");
  //   }
  // }, [logout]); 

  useMemo(() => {
    const bodyElement = document.body;
    if (mode === "dark") {
      bodyElement.classList.add("dark");
    } else {
      bodyElement.classList.remove("dark");
    }
  }, [mode]);

  return [colorMode, mode];
};

export const CustomThemeProvider = ({ children }) => {
  const [colorMode, mode] = useMode();

  return (
    <ColorModeContext.Provider value={{ colorMode, mode }}>
      <ThemeProvider>
        <div className={mode === "dark" ? "dark" : ""}>
          {children}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

