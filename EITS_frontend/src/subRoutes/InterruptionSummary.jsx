import React, { useEffect, useState } from "react";
import { ElectricBolt, TimelapseSharp } from "@mui/icons-material";
import TagIcon from "@mui/icons-material/Tag";
import { Typography } from "@material-tailwind/react";
import { DataGrid } from "@mui/x-data-grid";

import Intro from "../component/UI/Intro";
import StatsOverview, {StatCard} from "../component/UI/StatusOverview";
import { RightWidget, SelectOption } from "./ExpressDetail";
import DoubleBarchart from "../component/charts/DoubleBarchart";
import useFetch from "../customHook/useFetch";
import DurationTable from "../component/tables/DurationTable";
import LineChart from "../component/charts/Linechart";
import Export from "../component/UI/Export";
import { NoteForm } from "../component/UI/Notes";






const columns = [
  { field: "id", headerName: "ID", width: 70, flex: 1 },
  { field: "express", headerName: "Express", width: 120, flex: 1 },
  { field: "feeder", headerName: "Feeder", width: 120, flex: 1 },
  { field: "period", headerName: "Period", width: 100, flex: 1 },
  { field: "frequency", headerName: "Frequency", width: 120, flex: 1 },
  { field: "duration", headerName: "Duration", width: 180, flex: 1 },
  { field: "year", headerName: "Year", width: 100, flex: 1 },
];

export function parseDuration(durationStr) {
  if (durationStr.includes(" ")) {
    const [days, time] = durationStr.split(" ");
    const [hours, minutes, seconds] = time.split(":").map(Number);

    return (
      Number(days) * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds
    );
  } else {
    const [hours, minutes, seconds] = durationStr.split(":").map(Number);

    return hours * 60 * 60 + minutes * 60 + seconds;
  }
}

export default function InterruptionSummary() {
  const currentperiod = {
    year: new Date().getFullYear(),
    half: new Date().getMonth() + 1 > 6 ? 2 : 1,
  };

  const [listOfYears, setListYear] = useState([]);
  const [curPeriod, setPeriod] = useState(currentperiod);
  const [prevPeriod, setPrevPeriod] = useState(prevperiodFinder());
  const [summaryValue, setsummaryValue] = useState({
    longestDuration: {},
    frequentLine: {},
  });

  const { error, loading, data } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruption_summary/?year=${curPeriod.year}&period=${curPeriod.half}`
  );

  const {
    loading: yearLoading,
    error: yearError,
    data: listYear,
  } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruptions/get_availble_year/
`
  );

  //peroid or six month finder
  function prevperiodFinder() {
    let previousperiod = {};
    if (curPeriod.half == 1) {
      previousperiod = {
        year: curPeriod.year - 1,
        half: 2,
      };
    } else {
      previousperiod = {
        year: curPeriod.year,
        half: 1,
      };
    }
    return previousperiod;
  }

  const onYearHandler = (value) =>
    setPeriod((period) => ({ ...period, year: value }));
  const onPeriodHandler = (value) =>
    setPeriod((period) => ({ ...period, half: value }));

  useEffect(() => {
    setPrevPeriod(prevperiodFinder());
  }, [curPeriod]);

  useEffect(() => {
    if (listYear) setListYear(listYear);
  }, [listYear]);

  useEffect(() => {
    let summaryResult = {
      longestDuration: "",
      frequentLine: "",
    };
    if (data && data.length > 0) {
      summaryResult.frequentLine = data.reduce((acc, cur) => {
        return acc.frequency > cur.frequency ? acc : cur;
      });
      summaryResult.longestDuration = data.reduce((acc, cur) => {
        const accDurationInSeconds = parseDuration(acc.duration);
        const curDurationInSeconds = parseDuration(cur.duration);
        return curDurationInSeconds > accDurationInSeconds ? cur : acc;
      }, data[0] || {});
    }
    setsummaryValue((prev) => ({ ...prev, ...summaryResult }));
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Intro
          title="Express Interruption Summary"
          subtitle="A general analysis of data from all expresss  across time periods."
        />
        <div className="flex">
          <div>
            <Typography className=" font-bold font ">
              Six-Month Performance Report
            </Typography>
            <Typography className="text-[0.7rem]">
              A Comparative Analysis with the Previous Period
            </Typography>
          </div>
          <SelectOption options={listOfYears} onChangeHandler={onYearHandler} />
          <SelectOption
            options={["1", "2"]}
            value={curPeriod.half}
            onChangeHandler={onPeriodHandler}
          />
        </div>
      </div>

      <StatsOverview>
        <StatCard
          title="TOTAL NUMBER"
          data={data && data.length}
          icon={<TagIcon />}
          error={error}
          loading={loading}
        />

        <StatCard
          title="Longest Stay in Down"
          data={`${summaryValue.longestDuration.duration}`}
          icon={<TimelapseSharp />}
          error={error}
          loading={loading}
          subiTem={`${summaryValue.longestDuration.express}-${summaryValue.longestDuration.feeder} `}
        />
        <StatCard
          title="Most frequent Interruppted Line"
          data={`${summaryValue.frequentLine.frequency}`}
          icon={<ElectricBolt />}
          error={error}
          loading={loading}
          subiTem={`${summaryValue.frequentLine.express}-${summaryValue.frequentLine.feeder}`}
        />
      </StatsOverview>
      <div>
        <div className="flex flex-col min-h-[75vh] gap-[1rem] ">
          <div className="flex h-full  gap-[1rem]">
            <div className=" flex-1 flex flex-col gap-[4rem]">
              <div className="flex p-[1rem] bg-white  shadow rounded dark:bg-primary-dark-500 dark:text-white ">
                <div className="flex-1 ">
                  <LineChart
                    URL={`http://127.0.0.1:8000/interruption_data/interruption_summary/monthly_summary_of_year/?year=${prevPeriod.year}`}
                    period={prevPeriod.half}
                    year={prevPeriod.year}
                  />
                  <Typography className="text-center">
                    {" "}
                    previous six month express report{" "}
                  </Typography>
                </div>
                <div className="flex-1 ">
                  <LineChart
                    URL={`http://127.0.0.1:8000/interruption_data/interruption_summary/monthly_summary_of_year/?year=${curPeriod.year}`}
                    period={curPeriod.half}
                    year={curPeriod.year}
                  />
                  <Typography className="text-center">
                    {" "}
                    current six month express report{" "}
                  </Typography>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-[2rem] max-w-[20rem]">
              <RightWidget title="Top Three Frequently Interrupted Line">
                <p>
                  "Sort the table by the 'Interruptions' column to see the top
                  three frequently interrupted lines".
                </p>
              </RightWidget>
              <RightWidget title="Export Data">
                <Export />
              </RightWidget>
              <NoteForm topic={"overall"} />
            </div>
          </div>
          <div className="flex gap-[2rem] items-center">
            <div className=" bg-white rounded shadow-sm p-[2rem] flex-1 dark:bg-primary-dark-500 dark:text-white ">
              <DoubleBarchart curPeriod={curPeriod} prevPeriod={prevPeriod} />
            </div>
            <div className="w-[25rem]">
              <Typography className=" text-center">
                current six month Total Stay In Down{" "}
              </Typography>

              <DurationTable curPeriod={curPeriod} prevPeriod={prevPeriod} />
            </div>
          </div>
        </div>
        <div className=" my-[2rem]">
          <div className="grid">
            <DataGrid
              columns={columns}
              rows={data}
              checkboxSelection
              pagination
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 7,
                  },
                },
              }}
              className=" dark:text-customColor-light-100 dark:bg-primary-dark-500"
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: " black",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#333",
                },
              }}
              pageSizeOptions={[7]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
