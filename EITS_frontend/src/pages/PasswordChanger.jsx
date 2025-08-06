import React, { useEffect } from "react";
import { Close } from "@mui/icons-material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, Spinner } from "@material-tailwind/react";
import * as Yup from "yup";
import usePost from "../customHook/usePost";

import ServerErrorShowUp from "../component/errors/ServerErrorShowUp";
const URL = "http://127.0.0.1:8000/accounts/change_password/";

const initialValues = {
  new_password: "",
  old_password: "",
  confirm_password: "",
};

const passwordSchema = Yup.object().shape({
  old_password: Yup.string().required("Old password is required"),

  new_password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  // .matches(
  //   /[@$!%*?&#]/,
  //   "Password must contain at least one special character"
  // ),

  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

export default function PasswordChanger({ onclickHandler,onSuccess }) {
  const { error, data, loading, setPost } = usePost();
  const onSubmitHandler = (values,{setSubmitting, resetForm}) => {
    setPost(URL, values);
    if(!loading)setSubmitting(false)
  };

useEffect(()=>{
if(data)
  setTimeout(
  onSuccess(),1000)
},[data])


  return (
    <div className="flex flex-col h-dvh items-center justify-center bg-[#0000009d] absolute w-full z-50 text-[#060606]">
      <button
        className=" absolute top-0 right-0 m-[2rem] text-[white] text-[3rem] "
        onClick={() => onclickHandler(false)}
      >
      <Close />
      </button>


<>
  {loading &&<Spinner/>}
  {!loading&&error&&<ServerErrorShowUp error={error}/>}
  {!loading&&!error&&data&&<p className=" text-[white] bg-[#10d1c4]">{data.detail}</p>}
</>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitHandler}
        validationSchema={passwordSchema}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className=" bg-[rgb(255,255,255)] p-[2rem] rounded shadow-lg flex flex-col gap-3">
            <div className="flex flex-col gap-[0.5rem] ">
              <label htmlFor="old_password">Current Password:</label>
              <Field
                type="password"
                name="old_password"
                className={`${
                  touched.old_password && errors.old_password
                    ? " border border-red-500"
                    : ""
                } px-[0.4rem] my-[0.4rem] bg-blue-gray-200`}
              />
              <div className="h-[1rem]">
                <ErrorMessage
                  name="old_password"
                  component="small"
                  className=" text-red-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[0.2rem]">
              <label htmlFor="new_password">New Password:</label>
              <Field
                type="password"
                name="new_password"
                className={`${
                  touched.new_password && errors.new_password
                    ? " border border-red-500"
                    : ""
                } px-[0.4rem] my-[0.4rem] bg-blue-gray-200`}
              />
              <div className="h-[1rem]">
                <ErrorMessage
                  name="new_password"
                  component="small"
                  className=" text-red-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[0.2rem]">
              <label htmlFor="confirm_password">Confirm:</label>
              <Field
                type="password"
                name="confirm_password"
                className={`${
                  touched.confirm_password && errors.confirm_password
                    ? " border border-red-500"
                    : ""
                } px-[0.4rem] my-[0.4rem] bg-blue-gray-200`}
              />
              <div className="h-[1rem]">
                <ErrorMessage
                  name="confirm_password"
                  component="small"
                  className=" text-red-500"
                />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#10d1c4]"
              >
                {isSubmitting ? <Spinner /> : <>Change Password</>}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export function ChangePasswordSuggest({ onclickHandler }) {
  const onclickChanger = () => {
    onclickHandler(true);
  };
  return (
    <div className="bg-[#14615c] flex justify-between items-center pl-2 absolute top-0 left-0 rounded-sm">
      <p className="text-[#ffffff84]">
        Welcome to our platform! Please change your default password to ensure
        your account's security.
      </p>
      <Button onClick={onclickChanger} className="bg-[#10d1c4]">
        Change Default Password
      </Button>
    </div>
  );
}
