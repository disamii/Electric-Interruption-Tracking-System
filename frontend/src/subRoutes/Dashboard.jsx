import React, { useMemo } from "react";
import { NoteForm } from "../component/adminComponent/Notes";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "@material-tailwind/react";
import { countBy } from "lodash";


import { RightWidget } from "./ExpressDetail";
import StatsOverview, {StatCard,} from "../component/adminComponent/StatsOverview";
import Intro from "../component/adminComponent/Intro";
import Linechart from "../component/adminComponent/Linechart";
import { userFetch } from "../service/userDetailApi";



export default function Dashboard() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["totalUser"],
    queryFn: ()=>userFetch(),
  });


const suspendedUserCount = useMemo(() => {
    if (users) {
      const userCounts = countBy(users, (user) => user.active);
      return userCounts[false] || 0;
    }
    return 0;
  }, [users]);

  return (
    <div>
      <Intro title={"Dashboard"} subtitle={"admin dashboard"} />
      <StatsOverview>
        <StatCard
          data={users?.length}
          title={"Total User"}
          loading={isLoading}
          error={error}
        />
        <StatCard
          data={suspendedUserCount}
          title={"Suspended User"}
          loading={isLoading}
          error={error}
        />
        <StatCard title={"Unresponded Inbox"} />
        {/* notification */}
        <StatCard title={"Notification"} />
        {/* total chat */}
      </StatsOverview>
      <div className="flex gap-2">
        <div className="flex-1 bg-white  shadow rounded dark:bg-primary-dark-500 dark:text-white  p-3">
          <Linechart />
          <Typography className="text-center">
            current half year summary{" "}
          </Typography>
        </div>
        <div className=" w-[35rem] flex flex-col gap-2">
          <RightWidget>
            <p>total note </p>
          </RightWidget>
          <RightWidget>
            <NoteForm />
          </RightWidget>
        </div>
      </div>

      <div className="flex justify-between space-x-4 my-3">
        {["R1", "R2", "R3", "R4", "R5", "R6"].map((item, index) => (
          <div
            key={index}
            className="w-32 h-32 bg-white shadow-xl rounded-lg flex items-center justify-center text-lg font-semibold hover:shadow-2xl transition-transform transform hover:scale-105dark:shadow-deep-orange-900 dark:text-white dark:shadow-primary-light-200  dark:bg-primary-dark-500 shadow-deep-orange-900"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
