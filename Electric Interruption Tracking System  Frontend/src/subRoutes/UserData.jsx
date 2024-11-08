import React, { useState,useMemo } from "react";
import { IconButton } from "@material-tailwind/react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { ArrowBack, EditSharp } from "@mui/icons-material";
import { Spinner } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import _ ,{ countBy } from "lodash";


import { userFetch } from "../service/userDetailApi";
import { StatCard } from "../component/adminComponent/StatsOverview";
import ServerErrorShowUp from "../component/ServerErrorShowUp";
import StatsOverview from "../component/adminComponent/StatsOverview";
import Intro from "../component/adminComponent/Intro";
import UserTable from "../component/adminComponent/UserTable";


export default function UserData() {
  const [edit, setEdit] = useState(false);
  const onEditHandler = () => setEdit((prev) => !prev);
  
  const {
    data: users,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["totalUser"],
    queryFn: ()=>userFetch(),
  });

  const activeUserCount = useMemo(() => {
    if (users) {
      const userCounts = countBy(users, (user) => user.active);
      return userCounts[true] || 0;
    }
    return 0;
  }, [users]);

  
  const suspendedUserCount = useMemo(() => {
    if (users) {
      const userCounts = countBy(users, (user) => user.active);
      return userCounts[false] || 0;
    }
    return 0;
  }, [users]);

  return (
    <div className="  flex flex-col  min-h-full   ">
      <Intro title="  User Accounts" subtitle="user detail infromation  " />
      <div className="flex    min-h-full   flex-grow">
        <div className="my-4  min-w-full">
          {edit ? (
            <div>
              <div className="flex justify-between items-center">
                <IconButton onClick={onEditHandler}>
                  <ArrowBack />
                </IconButton>
                <IconButton className="">
                  <EditSharp />
                </IconButton>
              </div>
            </div>
          ) : (
            <div className="flex  justify-between items-center">
              <StatsOverview>
                <StatCard
                  title=" #User"
                  icon={<UserGroupIcon height="2rem" />}
                  loading={loading}
                  error={error}
                  data={users?.length}
                />
              </StatsOverview>
              <StatsOverview>
                <StatCard
                  title="Active User"
                  icon={<UserGroupIcon height="2rem" />}
                  loading={loading}
                  error={error}
                  data={activeUserCount}
                />
              </StatsOverview>
              <StatsOverview>
                <StatCard
                  title="Suspended User"
                  icon={<UserGroupIcon height="2rem" />}
                  loading={loading}
                  error={error}
                  data={suspendedUserCount}
                />
              </StatsOverview>
            </div>
          )}

          <div>
            {loading && <Spinner className="h-12  text-center m-auto w-full" />}
            {error && !loading && <ServerErrorShowUp error={error} />}
            {!error && !loading && users && (
              <UserTable
                edit={edit}
                onClickHandler={onEditHandler}
                userList={users}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
