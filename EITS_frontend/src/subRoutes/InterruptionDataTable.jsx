import React from "react";
import { TimelapseOutlined } from "@mui/icons-material";
import { TableCellsIcon } from "@heroicons/react/24/solid";
import { useParams } from "react-router-dom";

import Intro from "../component/UI/Intro";
import StatsOverview,{ StatCard } from "../component/UI/StatusOverview";
import InterruptionTable from "../component/tables/InterruptionTable";
import useFetch from "../customHook/useFetch";
import { convertToFormalDate } from "./ExpressDetail";



export default function InterruptionDataTable() {
  const { username } = useParams();
  const URL = username
    ? `http://127.0.0.1:8000/interruption_data/interruptions/?uploaded_by=${username}`
    : `http://127.0.0.1:8000/interruption_data/interruptions/`;
  const lATESTURL = username
    ? `http://127.0.0.1:8000/interruption_data/interruptions/get_latest_upload/?uploaded_by=${username}`
    : `http://127.0.0.1:8000/interruption_data/interruptions/get_latest_upload/`;

  const { error, loading, data,fetchData } = useFetch(URL);
  const {
    error: latestError,
    data: latestData,
    loading: latestLoading,
  } = useFetch(lATESTURL);

  return (
    <div>
      <Intro
        title="Interruption Data"
        subtitle="All Uploaded Interruption Data"
      />
      <StatsOverview>
        <StatCard
          title=" # Total Uploaded"
          icon={<TableCellsIcon height="2rem" />}
          error={error}
          loading={loading}
          data={data === null ? undefined : data.length}
        />
        <StatCard
          title=" # Lastest Upload"
          icon={<TimelapseOutlined height="2rem" />}
          error={latestError}
          loading={latestLoading}
          data={
            <>
              {latestData?.feeder},{latestData?.express},{latestData?.reason} 
              <> = uploaded at</> {convertToFormalDate(latestData?.created_at)}{" "}
            </>
          }
        />
      </StatsOverview>
      <InterruptionTable onUpdate={fetchData} />
    </div>
  );
}
