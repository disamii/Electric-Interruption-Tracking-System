import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "../component/navigation/SideBar";
import NavBar from "../component/navigation/NavBar";


export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);

  const onSidebarHandler = () => setCollapsed((prev) => !prev);
  return (
    <div className=" max-h-[100vh] max-w-[100vw] overflow-hidden dark:text-white dark:bg-primary-dark-400">
      <NavBar onClickHandler={onSidebarHandler} />
      <div className="flex min-h-[90vh]">
        <SideBar collapsed={collapsed} />
        <div className="m-[2rem] mr-0 pr-[2rem]  flex-auto  overflow-y-scroll max-h-[85vh] pb-[2remx]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
