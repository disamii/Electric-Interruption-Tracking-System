import React ,{useEffect}from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function StatsOverview({ children }) {
  return <div className=" flex justify-between my-[2rem]">{children}</div>;
}

export function StatCard({ title, icon, error, loading, data, subiTem }) {
  const navigate =useNavigate()
  useEffect(()=>{
    if(error?.detail)
    if (error.detail === "Given token not valid for any token type") {
  
    navigate("/login");
    }
  },[error])
  return (
    <div className="flex flex-col dark:bg-primary-dark-500 rounded p-[1rem] w-max items-center sh relative ml-[1rem] shadow-md dark:shadow-deep-orange-900 dark:text-white shadow-primary-light-200 bg-white  ">x
      <Typography>{title} </Typography>
      <span className=" absolute top-[-1rem] left-[-1rem]">{icon}</span>
      <div>
        {loading && <Spinner className="h-6 w-6 text-center" />}
        {error && !loading && <ErrorOutline color="red" />}
        {!error && !loading && data && (
          <>
        {subiTem&&<span className=" italic">
          {subiTem} {'>'}
        </span>}
            <span className=" font-extrabold">{data}</span>
          </>
        )}
      </div>
    </div>
  );
}
