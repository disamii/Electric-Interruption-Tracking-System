import React, { useContext } from "react";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import { BellAlertIcon, MoonIcon } from "@heroicons/react/16/solid";
import { Bars3Icon, SunIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

import { useRoute } from "../../context/RouteContext";
import { ColorModeContext } from "../../context/ThemeContext";
import { AdminProfile } from "../profiles/AdminProfile";

export default function NavBar({ onClickHandler }) {
  const { notification } = useRoute();
  const navigate = useNavigate();
  const { mode, colorMode } = useContext(ColorModeContext);

  const heightIcon = "1rem";
  return (
    <Navbar
      className={`mx-auto min-w-full px-4 py-4 lg:px-8 lg:py-4 text-black  z-[999] dark:bg-primary-dark-500 dark:text-primary-dark-100 dark:border-primary-dark-500 `}
    >
      <div className="flex  items-center justify-between text-primary-500 dark:text-primary-100">
        <div className="  flex items-center justify-between gap-[1rem]">
          <Typography>Admin Dashboard</Typography>
          <IconButton onClick={onClickHandler}>
            <Bars3Icon height={heightIcon} />
          </IconButton>
        </div>
        <div className="flex items-center gap-1">
          <div className="gap-[0.4rem] flex">
            <IconButton onClick={colorMode.toggleColorMode}>
              {mode === "light" ? (
                <MoonIcon height={heightIcon} />
              ) : (
                <SunIcon height={heightIcon} />
              )}
            </IconButton>
            <div className=" relative"   onClick={() => navigate("notification")}>
              <p className=" text-[green] text-[1.4rem] absolute top-[-1.4rem]  z-[99999]  p-1">
                {notification}
              </p>

              <IconButton >
                <BellAlertIcon height={heightIcon} />
              </IconButton>
            </div>
          </div>
          <div>
            <AdminProfile />
          </div>
        </div>
      </div>
    </Navbar>
  );
}
