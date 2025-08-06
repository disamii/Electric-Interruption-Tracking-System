import React, { useState } from "react";
import { Chat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  InboxArrowDownIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

export function AdminProfile() {
  const [menuOpen, setMenu] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const profileMenuItems = [
    {
      fun: () => navigate(`myprofile`),
      label: "My Profile",
      icon: UserCircleIcon,
    },
    { fun: () => navigate("chat_system"), label: "Chat", icon: Chat },
    {
      fun: () => navigate("notes"),
      label: "My Notes",
      icon: InboxArrowDownIcon,
    },

    { fun: () => logout(), label: "Sign Out", icon: PowerIcon },
  ];
  const handleClick = (fun) => {
    if (fun) {
      fun(); // Call the function if it exists
    } else {
      console.log("No action assigned");
    }
  };

  return (
    <Menu open={menuOpen} handler={setMenu}>
      <MenuHandler>
        <Avatar src="https://via.placeholder.com/50" />
      </MenuHandler>
      <MenuList>
        {profileMenuItems.map((item, index, key) => {
          const isLastItem = index === profileMenuItems.length - 1;
          return (
            <MenuItem key={index} onClick={() => handleClick(item.fun)}>
              {React.createElement(item.icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography icon={item.icon}>{item.label}</Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

