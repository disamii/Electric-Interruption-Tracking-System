import React, { useContext, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { Avatar, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Dashboard, FeedOutlined, TableBarOutlined } from "@mui/icons-material";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import { UsersIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/16/solid";
import { useSelectHandler } from "../../context/RouteContext";
import CycloneIcon from "@mui/icons-material/Cyclone";

export default function SideBar({ collapsed, selectedInoutlet }) {
  const { selected, onSelectHandler } = useSelectHandler(); //side bar active handler

  const navigate = useNavigate();
  const Item = ({ title, to, icon, selected, onSelectHandler }) => (
    <MenuItem
      active={title === selected}
      icon={icon}
      onClick={() => {
        onSelectHandler(title);
        navigate(to);
      }}
      className={`dark:bg-primary-dark-400  dark:text-white   ${
        title === selected ? "text-primary-light-300 bg-primary-light-100 dark:bg-primary-light-100" : ""
      } `}

>
      <Typography className="px-0">
        {title}
      </Typography>
    </MenuItem>
  );

  return (
    <Sidebar
      className=" rounded  absolute max-h-[90vh] custom"
      collapsed={collapsed}
    >
      <Menu className="dark:bg-primary-dark-500 dark:text-white  ">
        <div className="text-center bg-[#80808052] py-[1rem]">
          {!collapsed ? (
            <div>
              <Avatar src="https://via.placeholder.com/50" />
              <Typography>samson mamuye</Typography>
              <small>Admin</small>
            </div>
          ) : (
            <Avatar src="https://via.placeholder.com/50" />
          )}
        </div>


          <Item
            title="Dashboard"
            onSelectHandler={onSelectHandler}
            to="dashboard"
            selected={selected}
            icon={<Dashboard />}
          />
        

          <SubMenu
            label="User Adminstration"
            icon={<UsersIcon />}
            open
            className=""
            rootStyles={{
    root: {
      // Default styles for each MenuItem
      backgroundColor: (item) => (item.title === "Dashboard" ? 'blue' : 'black'), // Different background colors based on item
    },
    hover: {
      backgroundColor: (item) => (item.title === "Dashboard" ? 'green' : 'red'), // Different hover colors based on item
    },
  }}
          >
            <Item
              title="User Data"
              onSelectHandler={onSelectHandler}
              to="userData"
              selected={selected}
              icon={<DataThresholdingIcon />}
            />
            <Item
              title="User Form"
              onSelectHandler={onSelectHandler}
              to="userForm"
              selected={selected}
              icon={<UserPlusIcon />}
            />
          </SubMenu>
          <Item
            title="Overall Express Summary"
            onSelectHandler={onSelectHandler}
            to="InterruptionExpressDataSummary/"
            selected={selected}
            icon={<CycloneIcon />}
          />
          <SubMenu
            
            label="Interruption data report"
            icon={<TableBarOutlined />}
            open
          >
            <Item
              title="Total Data Table"
              onSelectHandler={onSelectHandler}
              to="interruptionDataTable"
              selected={selected}
              icon={<DataThresholdingIcon />}
            />
            <SubMenu label="Expresss Detail" icon={<FeedOutlined />} open className=" dark:bg-primary-dark-500" >
              <Item
                title="R1"
                onSelectHandler={onSelectHandler}
                to="InterruptionExpressDataDetail/R1"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
              <Item
                title="R2"
                onSelectHandler={onSelectHandler}
                to="InterruptionexpressDataDetail/R2"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
              <Item
                title="R3"
                onSelectHandler={onSelectHandler}
                to="InterruptionexpressDataDetail/R3"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
              <Item
                title="R4"
                onSelectHandler={onSelectHandler}
                to="InterruptionexpressDataDetail/R4"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
              <Item
                title="R5"
                onSelectHandler={onSelectHandler}
                to="InterruptionexpressDataDetail/R5"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
              <Item
                title="R6"
                onSelectHandler={onSelectHandler}
                to="InterruptionexpressDataDetail/R6"
                selected={selected}
                icon={<DataThresholdingIcon />}
              />
            </SubMenu>
          </SubMenu>
      </Menu>
    </Sidebar>
  );
}
