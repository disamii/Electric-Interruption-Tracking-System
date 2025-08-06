import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import { HashtagIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { Timelapse } from "@mui/icons-material";
import {
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { ErrorOutline } from "@mui/icons-material";

import useFetch from "../customHook/useFetch";
import Intro from "../component/UI/Intro";
import { useSelectHandler } from "../context/RouteContext";
import StatsOverview ,{ StatCard } from "../component/UI/StatusOverview";
import Barchart from "../component/charts/Barchart";
import { parseDuration } from "./InterruptionSummary";
import InterruptionTable from "../component/tables/InterruptionTable";
import { NoteForm } from "../component/UI/Notes";

//timestamp to  formal changer
export function convertToFormalDate(isoTimestamp) {
  const dateObj = new Date(isoTimestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formalDate = dateObj.toLocaleDateString("en-US", options);

  return formalDate;
}

//readeble duration

function formatTime(seconds) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  return `${days} days, ${hours} hours, ${minutes} minutes, ${secs} seconds`;
}

export const SelectOption = ({ onChangeHandler, value, options }) => {
  return (
    <select
      className="max-w-28 px-[1rem] py-2 rounded-lg border-[1px] mx-[1rem] dark:bg-primary-dark-500 dark:text-white "
      value={value}
      onChange={(e) => onChangeHandler(e.target.value)}
    >
      {options.map((option, key) => (
        <option value={option} key={key}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const RightWidget = ({ title, subtitle, children }) => {
  return (
    <Card className="p-[1rem] dark:bg-primary-dark-500 dark:text-white ">
      <Typography className=" font-bold">{title}</Typography>
      <Typography>{subtitle}</Typography>
      <div>{children}</div>
    </Card>
  );
};

export default function ExpressDetail() {
  const { onSelectHandler } = useSelectHandler();
  const navigation = useNavigate();
  const { express } = useParams();
  const currentYear = {
    reasonYear: new Date().getFullYear(),
    feederYear: new Date().getFullYear(),
    year: new Date().getFullYear(),
  };

  const [year, setYear] = useState(currentYear);
  const [currentexpress, setCurrentexpress] = useState(express);
  const [maxReason, setMaxReason] = useState("");
  const [maxfeeder, setMaxfeeder] = useState("");
  const [totalDuration, setTotalDuration] = useState("");
  const [longestDuration, setLongestDuration] = useState("");
  const [listOfYears, setListYear] = useState([]);
  const {
    loading: yearLoading,
    error: yearError,
    data: listYear,
  } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruptions/get_availble_year/
`
  );
  const { loading, error, data } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruptions/?express=${express}&year=${year.year}`
  );

  const {
    error: latestError,
    data: latestData,
    loading: latestLoading,
  } = useFetch(
    `http://127.0.0.1:8000/interruption_data/interruptions/get_latest_upload/?express=${express}`
  );

  //navigater through express
  const onChangeHandler = (value) => {
    setCurrentexpress(value);
    navigation(`/admin/InterruptionexpressDataDetail/${value}`, {
      replace: true,
    });
    onSelectHandler(value);
  };

  const onReasonYearHandler = (value) =>
    setYear((year) => ({ ...year, reasonYear: value }));
  const onfeederYearHandler = (value) =>
    setYear((year) => ({ ...year, feederYear: value }));
  const onYearHandler = (value) => {
    setYear((year) => ({ ...year, year: value }));
    onReasonYearHandler(value);
    onfeederYearHandler(value);
  };

  //year setter
  useEffect(() => {
    if (listYear) setListYear(listYear);
  }, [listYear]);

  //express setter
  useEffect(() => {
    if (express) setCurrentexpress(express);
  }, [express]);

  //status setter after data is fetched
  useEffect(() => {
    if (data && data.length > 0) {
      const initialAggData = {
        reason: {},
        feeder: {},
        totalDuration: 0,
        longestDuration: "00 00 00",
      };

      const aggData = data.reduce((acc, { reason, feeder, duration }) => {
        acc.reason[reason] = (acc.reason[reason] || 0) + 1;
        acc.feeder[feeder] = (acc.feeder[feeder] || 0) + 1;
        const parsedDuration = parseDuration(duration);
        acc.totalDuration += parsedDuration;
        acc.longestDuration =
          parseDuration(acc.longestDuration) > parsedDuration
            ? acc.longestDuration
            : duration;
        return acc;
      }, initialAggData);

      const findMostCommon = (obj) =>
        Object.entries(obj).reduce(
          (acc, cur) => (acc[1] > cur[1] ? acc : cur),
          []
        );

      setTotalDuration(formatTime(aggData.totalDuration));
      setLongestDuration(aggData.longestDuration);
      setMaxfeeder(findMostCommon(aggData.feeder));
      setMaxReason(findMostCommon(aggData.reason));
    }
  }, [data]);

  return (
    <div className=" space-y-6">
      <div className="flex justify-between items-center ">
        <Intro
          title={`${express} Detail`}
          subtitle={`every detail data of express ${express}`}
        />
        <div className=" min-w-28 flex ">
          <SelectOption
            onChangeHandler={onChangeHandler}
            value={currentexpress}
            options={["R1", "R2", "R3", "R4", "R5", "R6"]}
          />
          <SelectOption options={listOfYears} onChangeHandler={onYearHandler} />
        </div>
      </div>

      <StatsOverview>
        <StatCard
          loading={loading}
          error={error}
          data={data ? data.length : undefined}
          title="Total Interruptions"
          icon={<HashtagIcon height={30} />}
        />
        <StatCard
          title="Worst-Affected feeder"
          loading={loading}
          error={error}
          icon={<AdjustmentsHorizontalIcon height={30} />}
          data={maxfeeder ? maxfeeder[0] : undefined}
          subiTem={maxfeeder ? maxfeeder[1] : undefined}
        />
        <StatCard
          title="Most Common Cause"
          loading={loading}
          error={error}
          subiTem={maxReason ? maxReason[1] : undefined}
          data={maxReason ? maxReason[0] : undefined}
          icon={<RectangleStackIcon height={30} />}
        />

        <StatCard
          title=" Longest Interruption Duration"
          loading={loading}
          error={error}
          data={longestDuration}
          icon={<Timelapse height={30} />}
        />
      </StatsOverview>
      <div className="flex gap-[1rem]">
        <div className="flex gap-[2rem] bg-[white] dark:bg-primary-dark-500 dark:text-white p-[2rem] shadow-lg rounded flex-1">
          <div className="flex-1 ">
            <div className=" my-[2rem] flex justify-evenly items-center  ">
              <Typography>
                Frequency of Interruptions by <strong>Reason</strong>
              </Typography>
              {listOfYears && (
                <SelectOption
                  value={year.reasonYear}
                  onChangeHandler={onReasonYearHandler}
                  options={listOfYears}
                />
              )}
            </div>
            {express && (
              <Barchart
                express={express}
                XaxisValue="reason"
                yaxisValue="frequency"
                year={year.reasonYear}
                URL={`http://127.0.0.1:8000/interruption_data/interruptions/get_by/?express=${express}&by=reason&year=${year.reasonYear}`}
              />
            )}
          </div>
          <div className="flex-1 dark:bg-primary-dark-500 dark:text-white ">
            <div className="my-[2rem] flex  justify-evenly items-center">
              <Typography className=" ">
                {" "}
                Frequency of Interruptions by <strong>feeder</strong>
              </Typography>
              {listOfYears && (
                <SelectOption
                  value={year.feederYear}
                  onChangeHandler={onfeederYearHandler}
                  options={listOfYears}
                />
              )}
            </div>
            {express && (
              <Barchart
                yaxisValue="frequency"
                express={express}
                XaxisValue="feeder"
                year={year.feederYear}
                URL={`http://127.0.0.1:8000/interruption_data/interruptions/get_by/?express=${express}&by=feeder&year=${year.feederYear}`}
              />
            )}
          </div>
        </div>
        <div className=" flex flex-col gap-[2rem] justify-between">
          <RightWidget
            title={` Total Stay Down Duration of express ${express}`}
          >
            {loading && <Spinner className="h-6 w-6 text-center" />}
            {error && !loading && <ErrorOutline color="red" />}
            {!error && !loading && data && <>{totalDuration}</>}
          </RightWidget>
          <RightWidget title="Latest Interruption Upload">
            {latestLoading && <Spinner className="h-6 w-6 text-center" />}
            {latestError && !latestLoading && <ErrorOutline color="red" />}
            {!latestError && !loading && latestData && (
              <>
                {latestData.express},{latestData.feeder},{latestData.reason}{" "}
                <> = uploaded at</> {convertToFormalDate(latestData.created_at)}{" "}
              </>
            )}
          </RightWidget>
        <NoteForm topic={express}/>
        </div>
      </div>
      <InterruptionTable year={year.year} express={express} />
    </div>
  );
}
