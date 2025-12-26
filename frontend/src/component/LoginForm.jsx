import React from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import ServerErrorShowUp from "./ServerErrorShowUp";
import { useAuth } from "../context/AuthContext";

const intialState = {
  username: "disami",
  password: "disami",
};
const loginShema = Yup.object().shape({
  username: Yup.string().required("user name cant be empty"),

  password: Yup.string()
    .required("password is required")
    .min(6, "invaid password"),
});


export default function LoginForm() {
  const { handleSubmit} = useAuth();

  return (
    <div>
      <Formik
        initialValues={intialState}
        validationSchema={loginShema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form
            action=""
            className=" bg-[#ffffff]  w-[34rem] p-[3rem] shadow-2xl m-[0.1rem] relative"
          >
            <p className="text-center text-black font-semibold">
              please enter your credential
            </p>
            <div className="flex gap-[1rem] flex-col ">
              <div className="flex flex-col">
                <label htmlFor="userId">UserId</label>
                <Field
                  type="text"
                  name="username"
                  className="bg-[#f2f4f6] p-[0.5rem] px-[1rem] rounded"
                  placeholder="eg.sami123"
                />
                <div className="h-[1rem]">
                  {touched.username && errors.username && (
                    <ErrorMessage
                      component="small"
                      className="text-[red]"
                      name="username"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="bg-[#f2f4f6] p-[0.5rem] px-[1rem]"
                  placeholder="enter your password"
                />
                <div className="h-[1rem]">
                  {touched.password && errors.password && (
                    <ErrorMessage
                      component="small"
                      className="text-[red]"
                      name="password"
                    />
                  )}
                </div>
              </div>
              <small className=" underline ml-auto">
                forgot your password?
              </small>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#10d1c4] text-center"
              >
                {isSubmitting ? <Spinner className=" m-auto" /> : <>SIGN IN</>}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
