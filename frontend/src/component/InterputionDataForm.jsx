import React, { useEffect, useState } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import useFetch from "../customHook/useFetch";
import { Spinner, Button } from "@material-tailwind/react";
import ServerErrorShowUp from "./ServerErrorShowUp";
import usePost from "../customHook/usePost";

function calculateDuration(start_time, end_time, start_date, end_date) {
  const startDateTime = new Date(`${start_date}T${start_time}`);

  const endDateTime = new Date(`${end_date}T${end_time}`);

  const durationInMs = endDateTime - startDateTime;
  if (durationInMs < 0) return "End time must be after start time";

  const durationInSeconds = durationInMs / 1000;
  const days = Math.floor(durationInSeconds / (3600 * 24)); // Get the number of full days
  const hours = Math.floor((durationInSeconds % (3600 * 24)) / 3600); // Remaining hours
  const minutes = Math.floor((durationInSeconds % 3600) / 60); // Remaining minutes
  const seconds = Math.floor(durationInSeconds % 60); // Remaining seconds
  if (start_time && end_time && start_date && end_date)
    return `Duration: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  else return "...";
}

const choiceURL =
  "http://127.0.0.1:8000/interruption_data/interruptions/get_choices/";

const schema = Yup.object({
  express: Yup.string().required("required!"),
  feeder: Yup.string().required("required!"),
  G_express: Yup.string().required("required!"),
  operator: Yup.string().required("required!"),
  reason: Yup.string().required("required!"),
  start_date: Yup.string()
    .required("Start date is required")
    .matches(
      /^(\d{4})[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/,
      "Date must be in YYYY-MM-DD format"
    ),
  end_date: Yup.string()
    .required("Start date is required")
    .matches(
      /^(\d{4})[-](0[1-9]|1[0-2])[-](0[1-9]|[12][0-9]|3[01])$/,
      "Date must be in YYYY-MM-DD format"
    )
    .test(
      "dates-test",
      "End date should be after start date",
      function (value) {
        let start_date = moment(this.parent.start_date, "YYYY/MM/DD").toDate();
        let end_date = moment(value, "YYYY/MM/DD").toDate();
        return end_date > start_date;
      }
    )
    .required("End date is required"),
  start_time: Yup.string()
    .required("Start time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Start time must be in HH:MM or HH:MM:SS format"
    ),

  end_time: Yup.string()
    .required("End time is required")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "End time must be in HH:MM or HH:MM:SS format"
    )
    .test("time-test", "End time should be after start time", function (value) {
      const { start_time, start_date, end_date } = this.parent;
      const start_timeMoment = moment(start_time, "HH:mm");
      const end_timeMoment = moment(value, "HH:mm");
      const dateStart = moment(start_date, "YYYY/MM/DD");
      const dateEnd = moment(end_date, "YYYY/MM/DD");
      if (dateEnd.isSame(dateStart)) {
        return end_timeMoment.isAfter(start_timeMoment);
      }
      return true;
    }),
});





export default function InterputionDataForm({ initialValueProps }) {




  const {
    error: postError,
    loading: postLoading,
    data: postData,
    setPost,
  } = usePost();


  const [status, setStatus] = useState("");

  const [initialValue, setInitialValues] = useState({
    express: "",
    feeder: "",
    G_express: "",
    operator: "",
    reason: "",
    start_time: "",
    end_time: "",
    start_date: "",
    end_date: "",
  });
  const [choicesList, setChoicesList] = useState({
    express: [],
    feeder: [],
    G_express: [],
    reason: [],
  });
  const {
    error: choicesError,
    data: choices,
    loading: choicesLoading,
    setfetch,
  } = useFetch(choiceURL);

  useEffect(() => {
    if (initialValueProps) setInitialValues(initialValueProps);
  }, [initialValueProps]);


  useEffect(() => {
    if (choices) setChoicesList({ ...choices });
  }, [choices]);

  useEffect(() => {
    setTimeout(() => {
      if (status === "cancel") {
      }
      setStatus("");
    }, 5000);
  });

  useEffect(() => {
    if (status != "cancel") setfetch(choiceURL);
  }, [status]);



  const onSubmitHandler = async (values, { resetForm, setSubmitting }) => {
    const { id } = values;
    const requestMethod = id ? "PATCH" : "POST";
    const requestURL = id
      ? `http://127.0.0.1:8000/interruption_data/interruptions/${id}/`
      : `http://127.0.0.1:8000/interruption_data/interruptions/`;
    try {
      await setPost(requestURL, values, requestMethod);
      setInitialValues({
        express: "",
        feeder: "",
        G_express: "",
        operator: "",
        reason: "",
        start_time: "",
        end_time: "",
        start_date: "",
        end_date: "",
      });
      resetForm();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <div className="items-center   relative flex flex-col justify-center ">
      <div className=" float-right">
        {postLoading && <Spinner />}
        {!postLoading && postError && <ServerErrorShowUp error={postError} />}
        {!postLoading && !postError && postData && (
          <small className=" text-[green] float-rigth">
            data Successfully uploaded :)
          </small>
        )}
        {status === "cancel" && <small bgColor="bg-red-500">cancelled!</small>}
      </div>

      <Formik
        validationSchema={schema}
        initialValues={initialValue}
        onSubmit={onSubmitHandler}
        enableReinitialize
      >
        {({ touched, errors, values }) => {
          const duration = calculateDuration(
            values.start_time,
            values.end_time,
            values.start_date,
            values.end_date
          );
          return (
            <Form className="grid grid-cols-2 gap-x-[2rem] bg-[white] dark:bg-primary-dark-500 dark:text-white  px-[1rem] py-1  m-[2rem] w-[53rem] shadow-lg">
              <div className="formGroup">
                <label htmlFor="express">express</label>
                <Field
                  name="express"
                  as="select"
                  className={`Field ${
                    touched.express && errors.express
                      ? "border-[2px] border-[red] !important"
                      : ""
                  }`}
                  placeholder="select express"
                >
                  <option value="">
                    {choicesLoading && <>loading...</>}
                    {!choicesLoading && choicesError && <> error occured </>}
                  </option>
                  {!choicesLoading &&
                    !choicesError &&
                    choicesList.express.length &&
                    choicesList.express.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                </Field>
                <small className="error">
                  <ErrorMessage name="express" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="feeder">feeder</label>
                <Field
                  name="feeder"
                  as="select"
                  className={`Field ${
                  touched.feeder && errors.feeder
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                >
                  <option value="">
                    {choicesLoading && <>loading...</>}
                    {!choicesLoading && choicesError && <> error occured </>}
                  </option>
                  {!choicesLoading &&
                    !choicesError &&
                    choicesList.feeder.length &&
                    choicesList.feeder.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                </Field>
                <small className="error">
                  <ErrorMessage name="feeder" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="G_express">G Express</label>
                <Field
                  name="G_express"
                  as="select"
                  className={`Field ${
                    touched.G_express && errors.G_express
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                >
                  <option value="">
                    {choicesLoading && <>loading...</>}
                    {!choicesLoading && choicesError && <> error occured </>}
                  </option>
                  {!choicesLoading &&
                    !choicesError &&
                    choicesList.G_express.length &&
                    choicesList.G_express.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                </Field>
                <small className="error">
                  <ErrorMessage name="G_express" component="div" />
                </small>
              </div>
              <div className="formGroup">
                <label htmlFor="reason">Reason</label>
                <Field
                  name="reason"
                  as="select"
                  className={`Field ${
                    touched.reason && errors.reason
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                >
                  <option value="">
                    {choicesLoading && <>loading...</>}
                    {!choicesLoading && choicesError && choices && (
                      <>error occured</>
                    )}
                  </option>
                  {!choicesLoading &&
                    !choicesError &&
                    choicesList.reason.length &&
                    choicesList.reason.map((key) => (
                      <option value={key} key={key}>
                        {key}
                      </option>
                    ))}
                </Field>
                <small className="error">
                  <ErrorMessage name="reason" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="operator">Operator</label>
                <Field
                  name="operator"
                  type="text"
                  className={`Field ${
                    touched.operator && errors.operator
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                />
                <small className="error">
                  <ErrorMessage name="operator" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="start_time">Start Time</label>
                <Field
                  name="start_time"
                  type="time"
                  className={`Field ${
                    touched.start_time && errors.start_time
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                />
                <small className="error">
                  <ErrorMessage name="start_time" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="end_time">End Time</label>
                <Field
                  name="end_time"
                  type="time"
                  className={`Field ${
                    touched.end_time && errors.end_time
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                />
                <small className="error">
                  <ErrorMessage name="end_time" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="start_date">Start Date</label>
                <Field
                  name="start_date"
                  type="date"
                  className={`Field ${
                    touched.start_date && errors.start_date
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                />
                <small className="error">
                  <ErrorMessage name="start_date" component="div" />
                </small>
              </div>

              <div className="formGroup">
                <label htmlFor="end_date">End Date</label>
                <Field
                  name="end_date"
                  type="date"
                  className={`Field ${
                    touched.end_date && errors.end_date
                      ? "border-[2px] border-[red]"
                      : ""
                  }`}
                />
                <small className="error">
                  <ErrorMessage name="end_date" component="div" />
                </small>
              </div>
              <div className=" justify-center formGroup">
                <p className="Field">total time in stay {duration}</p>
              </div>
              <div className="flex gap-[2rem justify-between col-span-2  p-[0.3rem] font-sans">
                <Button type="submit" action="save and exit">
                  {postLoading ? <Spinner /> : <>Save </>}
                </Button>
                <Button
                  type="button"
                  action="cancel"
                  onclickHandler={() => {
                    setStatus("cancel");
                  }}
                >
                  Cancel and Exit
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
