import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner, Typography } from "@material-tailwind/react";


import useFetch from "../../customHook/useFetch";
import ServerErrorShowUp from "../errors/ServerErrorShowUp";

export default function Barchart({ express, XaxisValue,yaxisValue,year,URL }) {
  const { loading, error, data } = useFetch(URL
  );

  return (
    <>
      {loading && <Spinner className="h-12  text-center m-auto w-full dark:bg-primary-dark-500 dark:text-white " />}
      {error && !loading && <ServerErrorShowUp error={error} />}
      {!error && !loading && data && data.length == 0 && (
        <Typography className="text-center">
          no data is avialble for express {express} and year {year}
        </Typography>
      )}

      {!loading && !error && data && data.length != 0 && (
        <ResponsiveContainer width="100%" height={400} className={'dark:bg-primary-dark-500 dark:text-white '}>
          <BarChart data={data}>
            <XAxis
              dataKey={XaxisValue}
              label={{ value: XaxisValue, position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{
                value: `${yaxisValue}`,
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Bar dataKey={yaxisValue} fill="#0a8979" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
