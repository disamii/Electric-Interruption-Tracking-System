import { DataGrid } from "@mui/x-data-grid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import EditIcon from "@mui/icons-material/Edit";
import { ArrowBack, Delete, Try } from "@mui/icons-material";
import useDelete from "../../customHook/useDelete";
import useFetch from "../../customHook/useFetch";
import { Spinner } from "@material-tailwind/react";
import ServerErrorShowUp from "../ServerErrorShowUp";
import InterputionDataForm from "../InterputionDataForm";
export default function InterruptionTable({ year, express, onUpdate }) {
  
  let URL = `http://127.0.0.1:8000/interruption_data/interruptions/`;
  const { username } = useParams();
  if (username)
    URL = `http://127.0.0.1:8000/interruption_data/interruptions/?uploaded_by=${username}`;
  if (year && express)
    URL = `http://127.0.0.1:8000/interruption_data/interruptions/?express=${express}&year=${year}`;

  const initialState = {
    loading: false,
    error: null,
    message: "",
  };
  const [status, setStatus] = useState(initialState);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState({});
  const onEditHandler = () => setEdit((prev) => !prev);
  const { setDelete } = useDelete();
  const { error, loading, data, fetchData } = useFetch(URL);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialState);
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const onDeleteHandler = async (id) => {
    setStatus({
      loading: true,
      error: null,
      message: "",
    });

    try {
      const resp = await setDelete(
        `http://127.0.0.1:8000/interruption_data/interruptions/${id}`
      );
      fetchData();
      setStatus({
        loading: false,
        error: null,
        message: resp?.detail,
      });
      if (onUpdate) onUpdate();
    } catch (error) {
      setStatus({
        loading: false,
        error: error,
        message: "",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70, flex: 1 },
    { field: "express", headerName: "Express", width: 150, flex: 1 },
    { field: "feeder", headerName: "Feeder", width: 150, flex: 1 },
    { field: "G_express", headerName: "G Express", width: 150, flex: 1 },
    { field: "reason", headerName: "Reason", width: 200, flex: 1 },
    { field: "operator", headerName: "Operator", width: 150, flex: 1 },
    { field: "start_time", headerName: "Start Time", width: 150, flex: 1 },
    { field: "end_time", headerName: "End Time", width: 150, flex: 1 },
    { field: "start_date", headerName: "Start Date", width: 150, flex: 1 },
    { field: "end_date", headerName: "End Date", width: 150, flex: 1 },
    { field: "duration", headerName: "Duration", width: 150, flex: 1 },
    { field: "uploaded_by", headerName: "Uploaded BY", width: 150, flex: 1 },
    {
      field: "action",
      type: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => {
        const { id } = row;
        return (
          <Menu>
            <MenuHandler>
              <IconButton className=" bg-inherit dark:bg-primary-light-100">
                <ChevronDownIcon className=" text-[black] h-[1rem]" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className=" text-[0.6rem]"
                onClick={() => {
                  setEditValues(() => ({ ...row }));
                  onEditHandler();
                }}
              >
                <EditIcon className="h-[2rem]  mx-3" />
                Edit
              </MenuItem>
              <MenuItem
                className=" text-[0.6rem]"
                onClick={() => onDeleteHandler(id)}
              >
                <Delete className="h-[2rem]  mx-3" />
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  return (
    <div className="grid">
      <div>
        {edit && (
          <IconButton className=" bg-inherit" onClick={onEditHandler}>
            <ArrowBack className=" text-[black]" />
          </IconButton>
        )}
      </div>
      <div className=" flex justify-end">
        {status.loading && <Spinner />}
        {status.error && <ServerErrorShowUp error={status.error} />}
        {status.message && (
          <small className=" float-right text-[green]">{status.message}</small>
        )}
      </div>
      {edit ? (
        <InterputionDataForm initialValueProps={editValues} />
      ) : (
        <>
          {loading && <Spinner className=" text-center w-full" />}
          {!loading && error && <ServerErrorShowUp error={error} />}
          {!loading && !error && data && (
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
              pageSizeOptions={[7]}
              className=" dark:text-customColor-light-100 dark:bg-primary-dark-500"
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: " black",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#333",
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
