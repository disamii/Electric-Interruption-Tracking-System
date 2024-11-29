import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner, Typography } from "@material-tailwind/react";

import useFetch from "../../customHook/useFetch";
import ServerErrorShowUp from "../errors/ServerErrorShowUp";

export default function DoubleBarchart({ curPeriod, prevPeriod }) {
  const [curData, setCurData] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [data, setData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

  const {
    data: currData,
    error: curError,
    loading: curLoading,
  } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruption_summary/six_month_summary/?year=${curPeriod.year}&period=${curPeriod.half}`
  );

  const {
    data: prevvData,
    error: prevError,
    loading: prevLoading,
  } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruption_summary/six_month_summary/?year=${prevPeriod.year}&period=${prevPeriod.half}`
  );

  const aggData = (data) => {
    const frequencyPeriod = [
      "frequency of current period",
      "frequency of previous period",
    ];

    const result = data.reduce((acc, cur) => {
      let existexpress = acc.find((obj) => obj.express === cur.express);
      let periodKey = 0;

      if (!existexpress) {
        existexpress = { express: cur.express };
        frequencyPeriod.forEach((period) => (existexpress[period] = 0));
        acc.push(existexpress);
      }

      if (Number(curPeriod.half) === cur.period) periodKey = frequencyPeriod[0];
      if (Number(prevPeriod.half) === cur.period)
        periodKey = frequencyPeriod[1];

      if (frequencyPeriod.includes(periodKey)) {
        existexpress[periodKey] = (existexpress[periodKey] || 0) + cur.frequency;
      }

      return acc;
    }, []);

    return result.sort((a, b) => a.express.localeCompare(b.express));
  };

  useEffect(() => {
    setCurData(currData || []);
    setPrevData(prevvData || []);
  }, [currData, prevvData]);

  useEffect(() => {
    setData([...curData, ...prevData]);
  }, [curData, prevData]);

  useEffect(() => {
    if (data.length > 0) {
      const result = aggData(data);
      setUpdatedData(result);
    }
  }, [data]);

  return (
    <>
      {(curLoading || prevLoading) && (
        <Spinner className="h-12 text-center m-auto w-full" />
      )}

      {((prevError && !prevLoading) || (curError && !curLoading)) && (
        <ServerErrorShowUp error={curError || prevError} />
      )}

      {!prevError && !prevLoading && !curError && !curLoading && data.length === 0 && (
        <Typography className="text-center">
          No data is available for all expresss over both period
        </Typography>
      )}

      {!prevError && !prevLoading && !curError && !curLoading && data.length > 0 && (curData.length ==0 || prevData.length == 0 )&&(
        <Typography className="text-center">
          No data is available for all expresss over 
          {curData.length === 0 ? " current period" : " previous period"}
        </Typography>
      )}

      {(!prevError && !prevLoading && !curError && !curLoading) && curData.length > 0 && prevData.length > 0 && updatedData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={updatedData}>
            <XAxis
              dataKey="express"
              label={{ value: "express", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              label={{ value: "Frequency", angle: -90, position: "insideLeft", offset: 10 }}
            />
            <Bar dataKey="frequency of current period" fill="green" />
            <Bar dataKey="frequency of previous period" fill="blue" />
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
}
