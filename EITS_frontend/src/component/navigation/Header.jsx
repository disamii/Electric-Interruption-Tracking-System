import React, { useState, useEffect } from "react";
import {
  Drawer,
  Navbar,
  Typography,
  Button,
  IconButton,
  ListItem,
  List,
  Avatar,
} from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import {
  ContactMail,
  GraphicEq,
  LoginOutlined,
  NotificationAdd,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import ServerErrorShowUp from "../errors/ServerErrorShowUp";
import { useAuth } from "../../context/AuthContext";
import { ChangePasswordSuggest } from "../../pages/PasswordChanger";
import logo from "../../assets/images/outputLogo.png";
import UserProfile from "../profiles/UserProfile";




export default function Header({ onclickHandler, ispasswordchange }) {
  const { logout,userProfile:user,loading,error} = useAuth();

  const [passwordChanged, setPasswordChanged] = useState(true);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    const newlyLogged = localStorage.getItem("is_password_changed");
    if (newlyLogged === true) setPasswordChanged(true);
    else setPasswordChanged(false);

    if (ispasswordchange?.isSuccessfull) {
      localStorage.setItem("is_password_changed", true);
      setTimeout(() => {
        setPasswordChanged(true);
      }, 1000);
    }
  }, [ispasswordchange?.isSuccessfull, user, onclickHandler]);

  return (
    <>
      <Navbar className=" shadow-black min-w-full border-none rounded-none pt-0 bg-primary-light-300 h-[11rem] overflow-hidden flex justify-between items-center relative">
        {!passwordChanged && (
          <ChangePasswordSuggest onclickHandler={onclickHandler} />
        )}
        <div className="flex flex-col  h-full  items-center justify-end">
          <div className="flex flex-col items-center">
            <figure className="h-[5rem] w-[5rem]   ">
              <img
                src={logo}
                alt=""
                className="h-full w-full object-cover object-bottom "
              />
            </figure>
            <IconButton
              onClick={openDrawer}
              className=" bg-inherit shadow-none  mt-auto "
            >
              <Bars3Icon height={20} />
            </IconButton>
          </div>
        </div>
        <div>
          <Typography
            component="H1"
            className="text-center text-[Black] font-bold"
          >
            Ethiopia Electric Utility
          </Typography>
          <Typography>Electrical Interruption Report Form</Typography>
        </div>
        <UserProfile />
      </Navbar>

      <Drawer open={open} onClose={closeDrawer} className=" w-[15rem] ">
        <List className="parent">
          <ListItem className=" bg-[#80808052] py-[1rem] justify-center ">
            {error && !loading && <ServerErrorShowUp error={error} />}
            {!loading && !error && user ? (
              <div className="text-center m-auto">
                <Avatar src="https://via.placeholder.com/50" />
                <Typography>
                  {user.first_name} {user.last_name}{" "}
                </Typography>
                <small>{user.role}</small>
              </div>
            ) : (
              !loading && !error && !user && <Button>Log in</Button>
            )}
          </ListItem>
          <ListItem
            className=" "
            onClick={() => {
              navigate(`myprofile`);
              closeDrawer();
            }}
          >
            <Typography className="  ">Profile</Typography>
            <Person />
          </ListItem>
          <ListItem
            className=" "
            onClick={() => {
              navigate(`interruption_form`);
              closeDrawer();
            }}
          >
            <Typography className=" ">Interruption Form</Typography>
            <GraphicEq />
          </ListItem>
          <ListItem
            className=" "
            onClick={() => {
              navigate(`user_uploads/${user.username}`);

              closeDrawer();
            }}
          >
            <Typography className=" ">Upload Summary</Typography>
            <GraphicEq />
          </ListItem>
          <ListItem className="" onClick={() => navigate("notification")}>
            <Typography className=" ">Notification</Typography>
            <NotificationAdd />
          </ListItem>
          <ListItem
            className=" "
            onClick={() => {
              navigate(`user_chat`);
              closeDrawer();
            }}
          >
            <Typography className="  ">Contact Admin</Typography>
            <ContactMail />
          </ListItem>
          <ListItem onClick={logout} className="">
            <Typography className=" ">Log out</Typography>
            <LoginOutlined className=" " />
          </ListItem>{" "}
        </List>
      </Drawer>
    </>
  );
}
