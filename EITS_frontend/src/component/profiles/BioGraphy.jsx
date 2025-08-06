import React from "react";
import { Card,IconButton,Typography} from "@material-tailwind/react";

import { EditSharp } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";




export function BioGraphy({ data, onEditHandler }) {
    if (!data) {
      const { userProfile } = useAuth();
      data = userProfile;
    }
    const { userRole } = useAuth();
    return (
      <Card className="   shadow-lg rounded-lg bg-white dark:bg-primary-dark-500 dark:text-customColor-dark-400 p-[2rem] ">
        <div>
          <Typography
            variant="h5"
            component="h2"
            className="text-blue-600 mb-2 text-center"
          >
            Biography
          </Typography>
          <div className="space-y-2">
            <Typography variant="body1" component="p">
              <span className="font-semibold">Name:</span> {data.first_name}{" "}
              {data.last_name}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Grandfather's Name:</span>{" "}
              {data.user_profile.grand_father_name}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Email:</span> {data.email}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Phone Number:</span>{" "}
              {data.user_profile.phone_number}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Department:</span> {data.user_profile.dept}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Sub-Department:</span>{" "}
              {data.user_profile.sub_dept}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Role:</span> {data.role}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Active:</span>{" "}
              {data.is_active ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Staff:</span>{" "}
              {data.is_staff ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Superuser:</span>{" "}
              {data.is_superuser ? "Yes" : "No"}
            </Typography>
  
            <Typography variant="body1" component="p">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(data.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body1" component="p">
              <span className="font-semibold">Updated At:</span>{" "}
              {new Date(data.updated_at).toLocaleString()}
            </Typography>
            <div className="text-right">
              {onEditHandler && (
                <IconButton
                  onClick={onEditHandler}
                  disabled={userRole != "admin"}
                >
                  <EditSharp />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }
  