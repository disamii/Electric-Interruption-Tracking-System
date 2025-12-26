import React, { useState } from "react";
import { EditSharp } from "@mui/icons-material";
import ServerErrorShowUp from "./ServerErrorShowUp";
import { Chat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


import {
  Card,
  IconButton,
  Button,
  Spinner,
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

export default function UserProfile() {
  const { userProfile: user, error, loading: isLoading } = useAuth();
  return (
    <div className="flex justify-center items-center min-h-screen">
      {isLoading && (
        <div className="flex flex-col items-center">
          <Spinner className="m-auto" />
          <p className="mt-2 text-white">isLoading...</p>
        </div>
      )}
      {error && !isLoading && <ServerErrorShowUp error={error} />}
      {!isLoading && !error && user ? (
        <div className=" p-[1rem]   flex justify-center items-center gap-1 flex-col min-w-full ">
          <Avatar />
          <p>Hello {user.first_name}</p>
          <p>Welcome!</p>
        </div>
      ) : (
        !isLoading && !error && !user && <Button>Log in</Button>
      )}
    </div>
  );
}

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

export function BioGraphy({ data, onEditHandler }) {
  if (!data) {
    const { userProfile } = useAuth();
    data = userProfile;
  }
  const { userRole } = useAuth();
  return (
    <Card className="   shadow-lg rounded-lg bg-white dark:bg-primary-dark-500 dark:text-customColor-dark-400 p-[2rem] ">
      <div>
        <Typography
          variant="h5"
          component="h2"
          className="text-blue-600 mb-2 text-center"
        >
          Biography
        </Typography>
        <div className="space-y-2">
          <Typography variant="body1" component="p">
            <span className="font-semibold">Name:</span> {data.first_name}{" "}
            {data.last_name}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Grandfather's Name:</span>{" "}
            {data.grand_father_name}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Email:</span> {data.email}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Phone Number:</span>{" "}
            {data.phone_number}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Department:</span> {data.dept}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Sub-Department:</span>{" "}
            {data.sub_dept}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Role:</span> {data.role}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Active:</span>{" "}
            {data.is_active ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Staff:</span>{" "}
            {data.is_staff ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Superuser:</span>{" "}
            {data.is_superuser ? "Yes" : "No"}
          </Typography>

          <Typography variant="body1" component="p">
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(data.created_at).toLocaleString()}
          </Typography>
          <Typography variant="body1" component="p">
            <span className="font-semibold">Updated At:</span>{" "}
            {new Date(data.updated_at).toLocaleString()}
          </Typography>
          <div className="text-right">
            {onEditHandler && (
              <IconButton
                onClick={onEditHandler}
                disabled={userRole != "admin"}
              >
                <EditSharp />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
