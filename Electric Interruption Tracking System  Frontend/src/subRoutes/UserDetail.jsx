import React, { useState } from "react";
import { Spinner, Typography, Card } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


import Intro from "../component/UI/Intro";
import StatsOverview, {StatCard} from "../component/UI/StatusOverview";
import ServerErrorShowUp from "../component/errors/ServerErrorShowUp";
import UserForm from "../component/forms/UserForm";
import InterruptionTable from "../component/tables/InterruptionTable";
import Message from "../component/UI/Message";
import { BioGraphy } from "../component/profiles/BioGraphy";
import { getUser } from "../service/userDetailApi";

export default function UserDetail() {
  const [edit, setEdit] = useState(false);
  
const {username}=useParams()

  const {
    error,
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: ["userDetail"],
    queryFn: ()=>getUser(username),
  });

  const onEditHandler = () => setEdit((prev) => !prev);

  return (
    <div>
      <Intro title={"User Detail"} subtitle={"user detail Info"} />
      <div className="flex justify-between ">
        <StatsOverview>
          <StatCard
            title={"Total Upload"}
            error={error}
            data={data?.totalUpload}
            loading={loading}
          />
        </StatsOverview>
        <StatsOverview>
          <StatCard
            title={"LastTime Logged"}
            loading={loading}
            error={error}
            data={"2020"}
          />
        </StatsOverview>
        <StatsOverview>
          <StatCard
            title={"Status"}
            error={error}
            loading={loading}
            data={data?.is_active ? "Active" : "Suspended"}
          />
        </StatsOverview>
      </div>

      {loading && <Spinner className="h-12 text-center m-auto w-full" />}
      {error && !loading && <ServerErrorShowUp error={error} />}
      {!error && !loading && data && (
        <>
          <div className="flex justify-between min-w-full gap-[2rem] ">
            <div
              className={`flex-1 ${
                edit
                  ? "bg-white rounded dark:bg-primary-dark-500 px-[2rem]"
                  : ""
              } `}
            >
              {edit ? (
                <div className="">
                  <UserForm
                    initialValueProps={data}
                    setStatus={setStatus}
                    onClickHandler={onEditHandler}
                  />
                </div>
              ) : (
                <BioGraphy
                  data={data ? data : undefined}
                  onEditHandler={onEditHandler}
                />
              )}
            </div>
            <Card className="flex-1 flex gap-1 flex-col rounded-lg dark:bg-primary-dark-500">
              <Typography className="p-2 text-center" component={"h3"}>
                User Messages
              </Typography>
              <div className=" h-[30rem]">
                <Message />
              </div>
            </Card>
          </div>
          <div className="my-[2rem] ">
            <Typography className="text-center font-bold">
              Successfully uploaded Data
            </Typography>
            <InterruptionTable/>
          </div>
        </>
      )}
    </div>
  );
}
