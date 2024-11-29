import React from "react";
import ServerErrorShowUp from "../errors/ServerErrorShowUp";
import {Button,Spinner,Avatar} from "@material-tailwind/react";

import { useAuth } from "../../context/AuthContext";

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
  