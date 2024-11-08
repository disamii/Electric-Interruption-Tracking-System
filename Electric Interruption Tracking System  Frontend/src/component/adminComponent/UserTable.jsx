import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import PasswordIcon from "@mui/icons-material/Password";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import EditIcon from "@mui/icons-material/Edit";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import UserForm from "../adminComponent/UserForm";
import { BookmarkAddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  deleteUser,
  resetPasswordUser,
  suspendUser,
} from "../../service/userDetailApi";

function UserTable({ edit, onClickHandler, userList }) {
  const navigate = useNavigate();
  const [editValues, setEditValues] = useState({});
  const queryClient = useQueryClient();

  const SuspendeUserMutation = useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      toast.success("user   status updated successfully");
      queryClient.invalidateQueries("users");
    },
    onError:()=>{
      toast.error('unable to update user status')
    },
  });

  const resetPasswordUserMutation = useMutation({
    mutationFn: resetPasswordUser,
    onSuccess: () => {
      toast.success("user password reseted successfully");

      queryClient.invalidateQueries("users");
    },
    onError:()=>{
      toast.error('unable to reset password user')
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("user deleted successfully");
      queryClient.invalidateQueries("users");
    },
    onError:()=>{
      toast.error('unable to delete user')
    }
  });

  const handleSuspendUser = (username) => {
    SuspendeUserMutation.mutate(username);
  };

  const handleResetPasswordUser = (username) => {
    resetPasswordUserMutation.mutate(username);
  };

  const handleDeleteUser = (username) => {
    deleteUserMutation.mutate(username);
  };

  const columns = [
    { field: "username", headerName: "Username", width: 70, flex: 3 },
    { field: "first_name", headerName: "First name", width: 70, flex: 3 },
    { field: "last_name", headerName: "Last name", width: 70, flex: 3 },
    { field: "dept", headerName: "Departement", width: 70, flex: 3 },
    { field: "email", headerName: "Email", width: 70, flex: 4 },
    {
      field: "is_active",
      headerName: "Active",
      renderCell: ({ row }) => {
        return <>{row?.is_active ? <PersonIcon /> : <PersonOffIcon />}</>;
      },

      width: 70,
      flex: 2,
    },
    { field: "role", headerName: "Role", width: 70, flex: 2 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      renderCell: ({ row }) => {
        const { username, is_active, role } = row;
        return (
          <Menu>
            <MenuHandler>
              <IconButton className=" bg-inherit dark:bg-primary-light-100">
                <ChevronDownIcon className=" text-[black] h-[1rem]" />
              </IconButton>
            </MenuHandler>
            <MenuList className=" text-[1rem] w-[1rem] dark:bg-primary-dark-500 dark:text-white ">
              <MenuItem
                className=" text-[0.6rem]"
                onClick={() => handleResetPasswordUser(username)}
              >
                <PasswordIcon className="h-[2rem] mx-3" />
                Reset Password
              </MenuItem>
              <MenuItem
                className=" text-[0.6rem] "
                onClick={() => {
                  setEditValues(() => ({ ...row }));
                  onClickHandler();
                }}
              >
                <EditIcon className="h-[2rem]  mx-3" />
                Edit
              </MenuItem>
              {role !== "admin" && (
                <MenuItem
                  className=" text-[0.6rem]"
                  onClick={() => handleSuspendUser(username)}
                >
                  {is_active ? (
                    <BookmarkRemoveIcon className="h-[2rem]  mx-3" />
                  ) : (
                    <BookmarkAddOutlined className="h-[2rem]  mx-3" />
                  )}
                  {is_active ? <>suspend</> : <>activate</>}
                </MenuItem>
              )}
              {role !== "admin" && (
                <MenuItem
                  className=" text-[0.6rem]"
                  onClick={() => handleDeleteUser(username)}
                >
                  <PersonRemoveIcon className="h-[2rem]  mx-3" />
                  Delete
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        );
      },
    },
    {
      field: "detail",
      headerName: "Details",
      width: 70,
      flex: 3,
      renderCell: (params) => (
        <Button
          color="blue"
          onClick={() => navigate(`/admin/user_detail/${params.row.username}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="grid ">
      {edit ? (
        <UserForm
          initialValueProps={editValues}
          onClickHandler={onClickHandler}
        />
      ) : (
        <>
          <DataGrid
            autosizeOnMount={false}
            columns={columns}
            rows={userList}
            checkboxSelection
            pagination
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            getRowId={(row) => row.username}
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
        </>
      )}
    </div>
  );
}
export default React.memo(UserTable);
