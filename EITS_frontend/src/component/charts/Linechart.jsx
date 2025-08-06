import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@material-tailwind/react";

import ServerErrorShowUp from "../errors/ServerErrorShowUp";
import { interruptionDataSummary } from "../../service/InterruptionAPI";

const dateYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const CurrentPeriod = currentMonth <= 6 ? 1 : 2;

const expresss = ["R1", "R2", "R3", "R4", "R5", "R6"];
const months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export default function Linechart({ period = CurrentPeriod, year = dateYear }) {

  const [updatedData, setUpdatedData] = useState([]);
  const queryclient = useQueryClient();

  const {
    error,
    isLoading: loading,
    data,
  } = useQuery({
    queryKey: ["interruptionSummary"],
    queryFn: () => interruptionDataSummary(year, period),
  });

  const mutation = useMutation({
    mutationFn: () => interruptionDataSummary(year, period),
    onSuccess: (data) => {
      setUpdatedData(modifyData(data));
      queryclient.invalidateQueries("interruptionSummary");
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, [year, period]);

  function modifyData(data=data) {
    let resp = [];
    if (data) {
      resp = data.reduce((acc, curr) => {

        if (period!= curr.period) return acc;

        let existingMonth = acc.find((obj) => obj.month === months[curr.month]);

        if (!existingMonth) {
          existingMonth = { month: months[curr.month] };
          expresss.forEach((express) => (existingMonth[express] = 0));
          acc.push(existingMonth);
        }
        existingMonth[curr.express] = curr.frequency;
        return acc;
      }, []);
      return resp;
    }
  }

  return (
    <div className="flex-1 ">
      <ResponsiveContainer width="100%" height={400}>
        {!error && !loading && updatedData && updatedData.length > 0 ? (
          <LineChart data={updatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="R1" stroke="#8884d8" />
            <Line type="monotone" dataKey="R2" stroke="#82ca9d" />
            <Line type="monotone" dataKey="R3" stroke="#ffc658" />
            <Line type="monotone" dataKey="R4" stroke="#ff7300" />
            <Line type="monotone" dataKey="R5" stroke="#d0ed57" />
            <Line type="monotone" dataKey="R6" stroke="#a4de6c" />
          </LineChart>
        ) : (
          <div className="flex h-full items-center justify-center ">
            {loading && <Spinner className="h-12  text-center m-auto w-full" />}
            {error && !loading && <ServerErrorShowUp error={error} />}
            {!error && !loading && updatedData && updatedData.length === 0 && (
              <p> no data available </p>
            )}
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}
