import React, { useEffect, useState } from "react";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import { Spinner } from "@material-tailwind/react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import UserForm from "../component/forms/UserForm";
import ServerErrorShowUp from "../component/errors/ServerErrorShowUp";
import Intro from "../component/UI/Intro";

export function Status({ status }) {
  return (
    <div className=" text-[rgb(0,0,0)] text-[1.3rem] rounded flex w-[20rem] items-center justify-center h-max dark:bg-primary-dark-500 dark:text-white ">
      {!status.error && !status.data && !status.loading && (
        <small className=" bg-[WHITE] p-[1rem] dark:bg-primary-dark-500 dark:text-white ">
          ready to register a user <AppRegistrationOutlinedIcon />
        </small>
      )}
      {status.loading && <Spinner />}
      {!status.error && status.data && !status.loading && (
        <small className=" bg-[#00800085] p-[1rem]">
          <DoneOutlineIcon />a user is successfully created{" "}
        </small>
      )}
      {status.error && !status.loading && (
        <ServerErrorShowUp error={status.error} />
      )}
    </div>
  );
}

export default function UserReg() {
  const initialStatus = {
    error: null,
    loading: false,
    data: null,
    message: "",
  };

  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialStatus);
    }, 2000);
    return () => clearTimeout(timer);
  }, [status])



  
  return (
    <div className=" text-black flex flex-col min-h-full ">
      <div className="flex justify-between items-center">
        <Intro
          title="User Registration "
          subtitle=" detail user fill up Forms"
        />
        <Status status={status} />
      </div>
      <UserForm setStatus={setStatus} status={status} />
    </div>
  );
}
