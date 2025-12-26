import { ArrowDropDown, ArrowDropUp, Delete, Edit } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import useFetch from "../../customHook/useFetch";
import ServerErrorShowUp from "../ServerErrorShowUp";
import {
  Collapse,
  IconButton,
  Spinner,
  Typography,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import usePost from "../../customHook/usePost";
import useDelete from "../../customHook/useDelete";

export function NoteForm({ topic, toBeEdited, onUpdate, setTobeEdited }) {
  const { setPost } = usePost();
  const initialState = {
    loading: false,
    error: null,
    message: "",
  };

  const [status, setStatus] = useState(initialState);
  const [initialValues, setInitialValues] = useState({
    content: "",
    title: "",
    priority: "medium",
  });

  useEffect(() => {
    if (toBeEdited) {
      setInitialValues(toBeEdited);
    }
  }, [toBeEdited]);

  const validation = Yup.object().shape({
    title: Yup.string().required("title  required"),
    content: Yup.string().required("content  required"),
  });

  const onSubmitHandler = async (values, { resetForm, setSubmitting }) => {
    const { id } = values;
    const requestMethod = id ? "PATCH" : "POST";
    const requestURL = id
      ? `http://127.0.0.1:8000/note/short_notes/${id}/`
      : `http://127.0.0.1:8000/note/short_notes/`;
    try {
      setStatus({
        loading: true,
        error: null,
        message: "",
      });
      const resp = await setPost(requestURL, values, requestMethod);
      setStatus({
        loading: false,
        error: null,
        message: "successfully submitted!",
      });
      resetForm();
      setInitialValues({
        content: "",
        title: "",
        priority: "medium",
      });
      if (toBeEdited) setTobeEdited();
      if (onUpdate) onUpdate();
    } catch (error) {
      setStatus({
        loading: false,
        error: error,
        message: "",
      });
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialState);
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <div className="flex flex-col gap-6">
      {console.log(toBeEdited)}
      <Typography className="text-center">
        {toBeEdited ? <>Editing...</> : <>Add Note</>}
      </Typography>
      <div className=" flex justify-end self-end">
        {status.loading && <Spinner />}
        {status.error && <ServerErrorShowUp error={status.error} />}
        {status.message && (
          <small className=" float-right text-[green]">{status.message}</small>
        )}
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={onSubmitHandler}
        enableReinitialize
      >
        {({
          touched,
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
          values,
        }) => (
          <Form className="flex flex-col gap-6">
            <Input
              variant="standard"
              value={values.title}
              label="Title"
              placeholder="Title"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${
                touched.title && errors.title ? "border-e-red-200" : ""
              }`}
            />
            <Textarea
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.content}
              name="content"
              variant="static"
              label={`sticky note ${topic ? `for ${topic} ` : " "}`}
              placeholder="Short Note"
              className={`${
                touched.content && errors.content ? "border-e-red-200" : ""
              }`}
            />
            <Button type="submit" disabled={isSubmitting}>
              save
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default function Notes() {
  
  const { error, data, loading, fetchData } = useFetch(
    "http://127.0.0.1:8000/note/short_notes/"
  );
  const { setDelete } = useDelete();
  const [adminNotes, setAdminNotes] = useState([]);
  const [isCollapase, setIsCollapase] = useState({});
  const [toBeEdited, setTobeEdited] = useState(null);
  const initialState = {
    loading: false,
    error: null,
    message: "",
  };
  const [status, setStatus] = useState(initialState);

  useEffect(() => {
    if (!loading && !error && data) setAdminNotes(data);
  }, [data, error, loading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(initialState);
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]);


  useEffect(() => {
    {
      const initialState = Array(adminNotes?.length)
        .fill(false)
        .reduce((acc, curr, index) => {
          acc[index] = curr;
          return acc;
        }, {});
      setIsCollapase(initialState);
    }
  }, [adminNotes]);

  const handleButtonClick = (index) => {
    setIsCollapase((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };



  const onDeleteHandler = async (id) => {
    setStatus({
      loading: true,
      error: null,
      message: "",
    });

    try {
      const resp = await setDelete(
        `http://127.0.0.1:8000/note/short_notes/${id}`
      );
      fetchData();
      setStatus({
        loading: false,
        error: null,
        message: resp?.detail,
      });
      fetchData();
    } catch (error) {
      setStatus({
        loading: false,
        error: error,
        message: "",
      });
    }
  };



  return (
    <div>
      {loading && <Spinner />}
      {!loading && error && <ServerErrorShowUp error={error} />}
      {!loading && !error && data && (
        <div className="flex flex-col gap-4 p-4 bg-gray-100 dark:bg-black">
          {adminNotes.map((note, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-primary-dark-500"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-primary-dark-400 rounded-t-lg"
                onClick={() => handleButtonClick(index)}
              >
                <Typography
                  variant="h6"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Title: {note.title}
                </Typography>
                <IconButton className="text-gray-600 dark:text-gray-400">
                  {isCollapase[index] ? <ArrowDropUp /> : <ArrowDropDown />}
                </IconButton>
              </div>
              <Collapse open={isCollapase[index]}>
                <div className="p-4 text-gray-700 dark:text-gray-300 flex">
                  <p className="flex-1">{note.content}</p>
                  <div className="space-y-1 flex  self-end">
                    <Edit onClick={() => setTobeEdited(note)} />
                    <Delete onClick={() => onDeleteHandler(note.id)} />
                  </div>
                </div>
              </Collapse>
            </div>
          ))}
          <div className=" flex justify-end">
            {status.loading && <Spinner />}
            {status.error && <ServerErrorShowUp error={status.error} />}
            {status.message && (
              <small className=" float-right text-[green]">
                {status.message}
              </small>
            )}
          </div>
          <NoteForm
            onUpdate={fetchData}
            toBeEdited={toBeEdited ? toBeEdited : undefined}
            setTobeEdited={toBeEdited ? setTobeEdited : undefined}
          />
        </div>
      )}
    </div>
  );
}
