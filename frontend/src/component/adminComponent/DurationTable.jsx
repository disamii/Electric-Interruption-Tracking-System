import React, { useEffect, useState } from "react";
import useFetch from "../../customHook/useFetch";
import { DataGrid } from "@mui/x-data-grid";
import { Spinner, Typography } from "@material-tailwind/react";
import ServerErrorShowUp from "../ServerErrorShowUp";

export default function DurationTable({ curPeriod, prevPeriod }) {
  const [compareduration, setComparedDuration] = useState([]);

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

  useEffect(() => {
    let updatedData = [];
    if (prevvData && currData) {

      updatedData = currData.map((curr,index) => {
        const matchedPrev = prevvData.find(
          (prev) => prev.express === curr.express
        );

        return {
          ...curr,
          durationPrevious: matchedPrev ? matchedPrev.duration_string : null,
          durationCurrent: curr.duration_string,id:index+1
        };
      });
    }
    setComparedDuration(updatedData)
    console.log(updatedData);
  }, [prevvData, currData]);



  const columns = [
    { field: "express", headerName: "express", width: 150, flex: 1 },
    { field: "durationPrevious", headerName: "Previous", width: 250, flex: 2 },
    { field: "durationCurrent", headerName: "Current", width: 250, flex: 2 },

  ];

  return (
    <div className="grid">
      {(curLoading || prevLoading) && (
        <Spinner className="h-12 text-center m-auto w-full" />
      )}

      {((prevError && !prevLoading) || (curError && !curLoading)) && (
        <ServerErrorShowUp error={curError || prevError} />
      )}

      {!prevError &&
        !prevLoading &&
        !curError &&
        !curLoading &&
        compareduration.length === 0 && (
          <Typography className="text-center">
            No data is available for all expresss over both period
          </Typography>
        )}

      {!prevError &&
        !prevLoading &&
        !curError &&
        !curLoading &&
        prevvData &&
        currData &&
        compareduration.length > 0 &&
        (prevvData.length == 0 || currData.length == 0) && (
          <Typography className="text-center">
            No data is available for all expresss over
            {currData.length === 0 ? " current period" : " previous period"}
          </Typography>
        )}

      {!prevError &&
        !prevLoading &&
        !curError &&
        !curLoading &&
        currData &&
        prevvData &&
        currData.length > 0 &&
        prevvData.length > 0 &&
        compareduration.length > 0 && (
          <DataGrid
            columns={columns}
            rows={compareduration}
            pagination
            autoHeight
            hideFooter
            className=" dark:text-customColor-light-100 dark:bg-primary-dark-500"
              sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: ' black',
            fontWeight: 'bold',
            fontSize: 16,
            color: '#333',
          },
        }}
          />
        )}
    </div>
  );
}
