import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { Input, Typography, Button, Spinner } from "@material-tailwind/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createUser, updateUser } from "../../service/userDetailApi";
import GoBack from '../GoBack'
const URL = "http://127.0.0.1:8000/accounts/user/";

export default function UserForm({ initialValueProps }) {
  const isEditing = initialValueProps ? true : false;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries("users");
    },
  });

  const initialValues = initialValueProps
    ? initialValueProps
    : {
        first_name: "",
        last_name: "",
        grand_father_name: "",
        dept: "",
        sub_dept: "",
        email: "",
        phone_number: "",
        role: "user",
      };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    grand_father_name: Yup.string().required("Grandfather name is required"),
    dept: Yup.string().required("Department is required"),
    // sub_dept: Yup.string().required("Sub-department is required"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address"
      )
      .required("Email is required"),
    phone_number: Yup.string()
      .matches(
        /^\+\d{12}$/,
        "Phone number must be in the format +251908897321, with exactly 12 digits following the + sign"
      )

      .required("Phone number is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleCancel = () => {
    if (isEditing) onClickHandler();
    else navigate("/admin/dashboard");
  };

  const onSubmitHandler = async (values, { setSubmitting, resetForm }) => {

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateUserMutation.mutateAsync(values);
        toast.success("user successfully edited ");
        GoBack()

      } else {
        await createUserMutation.mutateAsync(values);
        toast.success("user successfully created");
      }
      resetForm({ values: {} });

    } catch (error) {
      toast.error("un expected error occourred!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        isSubmitting,
      }) => (
        <Form className=" flex flex-col  gap-[1rem] w-full my-[2rem]  ">
          <div className=" col-span-3  px-[1rem] rounded-lg border-b-2 border-[#0000006b] dark:border-customColor-light-400  ">
            <Typography className=" dark:text-customColor-light-100">
              Complete Name
            </Typography>
          </div>
          <div className="  flex justify-between gap-[1rem]  flex-wrap">
            {values.username && (
              <div>
                <Typography className="">Username</Typography>
                <Input
                  name="username"
                  onBlur={handleBlur}
                  error={!!errors.username && !!touched.username}
                  onChange={handleChange}
                  value={values.username}
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900  w-max flex-grow min-w-[15rem]  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <small className=" text-[red]">
                  <ErrorMessage name="username" />
                </small>
              </div>
            )}
            <div>
              <Typography className=" dark:text-customColor-light-300">
                First Name
              </Typography>
              <Input
                name="first_name"
                onBlur={handleBlur}
                error={!!errors.first_name && !!touched.first_name}
                onChange={handleChange}
                value={values.first_name}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-max flex-grow min-w-[15rem] dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <small className=" text-[red]">
                <ErrorMessage name="first_name" />
              </small>
            </div>
            <div>
              <Typography className="dark:text-customColor-light-300">
                Father Name
              </Typography>
              <Input
                name="last_name"
                onBlur={handleBlur}
                error={!!errors.last_name && !!touched.last_name}
                onChange={handleChange}
                value={values.last_name}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-max flex-grow min-w-[15rem]  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <small className=" text-[red]">
                <ErrorMessage name="last_name" />
              </small>
            </div>{" "}
            <div>
              <Typography className="dark:text-customColor-light-300">
                Grandfather Name
              </Typography>
              <Input
                name="grand_father_name"
                onBlur={handleBlur}
                error={
                  !!errors.grand_father_name && !!touched.grand_father_name
                }
                onChange={handleChange}
                value={values.grand_father_name}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-max flex-grow min-w-[15rem]  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <small className=" text-[red]">
                <ErrorMessage name="grand_father_name" />
              </small>
            </div>
          </div>

          <div className=" col-span-3 px-[1rem] rounded-lg border-b-2 border-[#0000006b] dark:border-customColor-light-400">
            <Typography className=" dark:text-customColor-light-100">
              Departmental Structure
            </Typography>
          </div>
          <div className=" col-span-3 flex  w-full gap-[10rem]">
            <div className="flex-1">
              <Typography className="dark:text-customColor-light-300">
                Department
              </Typography>
              <Input
                name="dept"
                onBlur={handleBlur}
                error={!!errors.dept && !!touched.dept}
                onChange={handleChange}
                value={values.dept}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <small className=" text-[red]">
                <ErrorMessage name="dept" />
              </small>
            </div>
            <div className="flex-1">
              <Typography className="dark:text-customColor-light-300">
                Sub-Department
              </Typography>
              <Input
                name="sub_dept"
                onBlur={handleBlur}
                error={!!errors.sub_dept && !!touched.sub_dept}
                onChange={handleChange}
                value={values.sub_dept}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <small className=" text-[red]">
                <ErrorMessage name="sub_dept" />
              </small>
            </div>
          </div>
          <div className="  flex gap-[1rem]  justify-between w-full">
            <div className=" flex-[0.83]">
              <div className="  px-[1rem] rounded-lg border-b-2 border-[#0000006b] dark:border-customColor-light-400">
                <Typography className=" dark:text-customColor-light-100">
                  Address
                </Typography>
              </div>
              <div className="flex w-full gap-[1rem] ">
                <div className=" my-[2rem] flex-1">
                  <Typography className="dark:text-customColor-light-300">
                    EMAIL
                  </Typography>
                  <Input
                    name="email"
                    onBlur={handleBlur}
                    error={!!errors.email && !!touched.email}
                    onChange={handleChange}
                    value={values.email}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <small className=" text-[red]">
                    <ErrorMessage name="email" />
                  </small>
                </div>

                <div className=" my-[2rem] flex-1">
                  <Typography className="dark:text-customColor-light-300">
                    Phone Number
                  </Typography>
                  <Input
                    name="phone_number"
                    onBlur={handleBlur}
                    error={!!errors.phone_number && !!touched.phone_number}
                    onChange={handleChange}
                    value={values.phone_number}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900  dark:focus:bg-customColor-dark-200 dark:focus:text-black dark:text-white"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  />
                  <small className=" text-[red]">
                    <ErrorMessage name="phone_number" />
                  </small>
                </div>
              </div>
            </div>
            <div className="w-[45%] ">
              <div className=" col-span-3 px-[1rem] rounded-lg border-b-2 border-[#0000006b] dark:border-customColor-light-400">
                <Typography className=" dark:text-customColor-light-100">
                  Role
                </Typography>
              </div>
              <div className="my-[2rem]">
                <div className="flex flex-wrap">
                  <Typography className="dark:text-customColor-light-300">
                    Role
                  </Typography>
                  <Field
                    name="role"
                    as="select"
                    className={`w-full bg-inherit rounded-lg shadow-none  p-[0.6rem] dark:bg-primary-dark-400 dark:text-white 
                              ${
                                touched.role && errors.role
                                  ? "border-red-500 border-2"
                                  : "border-gray-300 border"
                              }`}
                  >
                    <option
                      value="user"
                      selected
                      className="dark:text-customColor-light-300"
                    >
                      User
                    </option>
                    <option value="admin"> Admin</option>
                    <option value="super_admin"> Super Admin</option>
                    <option value="team_leader">Team Leader</option>
                    <option value="SuperViser">SuperViser</option>
                  </Field>
                </div>
                <small className=" text-[red] text-center">
                  <ErrorMessage name="role" />
                </small>
              </div>
            </div>
          </div>
          <div className="col-span-3 flex justify-between items-center">
            <Button
              type="button"
              onClick={handleCancel}
              className=" bg-redAccent-light-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className=" bg-primary-light-300"
            >
              {isSubmitting ? <Spinner /> : <>Submitt</>}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
