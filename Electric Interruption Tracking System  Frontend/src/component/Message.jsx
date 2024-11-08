import React, { useState, useEffect, useRef } from "react";
import useFetch from "../customHook/useFetch";
import { useParams } from "react-router-dom";
import { IconButton, Spinner } from "@material-tailwind/react";
import ServerErrorShowUp from "../component/ServerErrorShowUp";
import { Edit } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import usePost from "../customHook/usePost";


export default function Message() {
  const { username } = useParams();
  const { username: currentUserName } = useAuth();
  const chatURL = username
    ? `http://127.0.0.1:8000/messages/chat/get_chat/?username=${username}`
    : `http://127.0.0.1:8000/messages/chat/get_chat/`;
  const { error, data, loading, fetchData} = useFetch(chatURL);
  const [conversation, setConversation] = useState([]);
  const scrollRef = useRef(null);
  const textRef = useRef(null);
  const { setPost } = usePost();
  const [initialMessage, setInitialMessage] = useState({
    message: "",
    id: null,
    sender: currentUserName,
    receiver: username,
  });

  // Update conversation when data is fetched
  useEffect(() => {
    if (data) {
      setConversation(data);
    }
  }, [data]);

  // Scroll to the bottom of the chat after messages are updated

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    // Focus the text field when the component mounts
    if (textRef.current) {
      textRef.current.focus();
    }
  }, []);

  
  // Sync initialMessage with currentUserName and username
  useEffect(() => {
    if (currentUserName && username) {
      setInitialMessage((prev) => ({
        ...prev,
        sender: currentUserName,
        receiver: username,
      }));
    }
  }, [username, currentUserName]);



  // Handle form submission
  const onSubmitHandler = async (values, { resetForm }) => {
    const { id } = values;
    const requestMethod = id ? "PATCH" : "POST";
    const requestURL = id
      ? `http://127.0.0.1:8000/messages/chat/${id}/`
      : `http://127.0.0.1:8000/messages/chat/`;

    try {
      await setPost(requestURL, values, requestMethod);
      resetForm();
      fetchData()
      setInitialMessage({
        message: "",
        id: null,
        sender: currentUserName,
        receiver: username,
      });
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };
  // Form validation schema
  const validationSchema = Yup.object({
    message: Yup.string().nullable().notRequired(),
  });

  return (
    <>
      {loading && <Spinner />}
      {!loading && error && <ServerErrorShowUp error={error} />}
      <>
        <div className="h-[30rem]  relative pb-[2rem]">
          <div
            className="px-2 flex flex-col gap-2  p-2 h-full min-w-full  overflow-y-scroll pb-[4rem]"
            ref={scrollRef}
          >
            {conversation.length ? (
              <>
                {conversation.map((msg, index, key) => (
                  <>
                    {msg.receiver === currentUserName ? (
                      <div
                        key={key}
                        className={` max-w-[50%] self-start rounded-lg ml-2 p-3   ${
                          msg.seen ? "bg-blue-100 " : "bg-gray-100"
                        } `}
                      >
                        <span
                          className={` max-w-full break-words whitespace-normal ${
                            msg.seen ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {msg.message}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={key}
                        className=" self-end max-w-[50%] bg-green-100 rounded-lg ml-2 p-3 "
                      >
                        <span className=" text-green-700 max-w-full break-words whitespace-normal ">
                          {msg.message}
                        </span>
                        <Edit
                          onClick={() =>
                            setInitialMessage((intialMessage) => ({
                              ...intialMessage,
                              message: msg.message,
                              id: msg.id,
                            }))
                          }
                        />
                      </div>
                    )}
                  </>
                ))}
              </>
            ) : (
              <p className="text-center dark:text-white   ">no message yet</p>
            )}
            <Formik
              initialValues={initialMessage}
              validationSchema={validationSchema}
              onSubmit={onSubmitHandler}
              enableReinitialize
            >
              {({ values, handleChange, handleBlur }) => (
                <Form className="flex  flex-col  self-end bottom-[-1rem] absolute   ">
                  <textarea
                    ref={textRef}
                    className="p-2 border rounded-lg w-[20rem] dark:text-white dark:bg-black"
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type your response here..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <IconButton
                    className="self-end text-[green] bg-[white]"
                    type="submit"
                  >
                    <SendIcon />
                  </IconButton>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </>
      {/* )} */}
    </>
  );
}
