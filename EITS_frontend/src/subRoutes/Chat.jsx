import useFetch from "../customHook/useFetch";
import {
  Collapse,
  IconButton,
  ListItem,
  Typography,
  List,
  Card,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Person } from "@mui/icons-material";

const USERLISTURL = `http://127.0.0.1:8000/accounts/user/get_userList/`;

export default function Chat() {
  const { error, data, loading } = useFetch(USERLISTURL);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userList, setUserList] = useState([{}]);
  const navigate = useNavigate();
  const {username}=useParams()
  useEffect(() => {
    if (!error && !loading && data) setUserList(data);
  }, [error, data, loading]);

  return (
    <div className="flex gap-2 items-center h-full ">
      <Card
        className={` space-y-2 p-4  dark:bg-primary-dark-500  ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="text-center">
          <IconButton
            color="white"
            variant="text"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-500" />
            )}
          </IconButton>
          <Typography className=" font-bold dark:text-primary-dark-100">
            User List
          </Typography>
        </div>
        <List className={` ${isCollapsed ? "min-w-2 " : "min-w-54"}   `}>
          {userList.map((user) => (
            <ListItem
              key={user.username}
              className={`dark:hover:bg-primary-dark-400 dark:text-white text-center   flex ${isCollapsed ? "justify-center" : " justify-start"}  `}
              onClick={() => navigate(`user_chat/${user.username}`)}
            >
              {!isCollapsed ? (
                <>
                  <Person />
                  <Typography>{user.name}</Typography>
                </>
              ) : (
                <Person />
              )}
            </ListItem>
          ))}
        </List>
      </Card>
      <div className="flex flex-col gap-2 flex-1">
      <div>
      {!username && ( 
        <p className="text-center">Select a chat to start messaging</p>
      )}
      {username && <Outlet />}  
    </div>
      </div>
    </div>
  );
}
