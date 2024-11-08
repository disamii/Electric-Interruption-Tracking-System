import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate} from "react-router-dom";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";


const handleError = (error) => {
  const location = useLocation();
  const navigate=useNavigate()
  const {logout}=useAuth()
  console.log(error)
useEffect(()=>{
  if (error.detail === "Given token not valid for any token type") {
    navigate("/login", { state: { from: location } });
    logout(); 
  }
},[error])


  if (typeof error === "object" && error !== null) {
    if (error.detail === "Given token not valid for any token type") {
      return <p>session expired!</p>;
    }

    return Object.keys(error).map((key) => (
      <div key={key} className="text-[1rem] center">
        <small className="text-[red]">
          {typeof error[key] === "string"
            ? // Directly display the string
              error[key]
            : typeof error[key] === "object"
            ? Array.isArray(error[key])
              ? // If it's an array, join and display the values
                error[key].join(", ")
              : // If it's an object, loop through its keys and display each value
                Object.keys(error[key]).map((subKey) => (
                  <div key={subKey}>
                    {subKey}: {error[key][subKey].toString()}
                  </div>
                ))
            : // Handle other types if necessary
              "Unknown error format"}
        </small>
      </div>
    ));
  } else {
    return <small className="text-[red]">{error}</small>;
  }
};

export default function ServerErrorShowUp({ error }) {
  console.log(error)
  return (
    error !== null && (
      <div className="my-[0.3rem] center flex-col w-full">
        <ExclamationTriangleIcon height={50} className=" m-auto text-[red]" />
        <div className=" flex flex-col px-[0.5rem] text-center">
          {handleError(error)}
          {console.log(error)}
          <a
            onClick={(event) => {
              window.location.reload();
            }}
            className="text-[0.8rem] text-blue-500  underline cursor-pointer self-center"
          >
            Try Again
          </a>
        </div>
      </div>
    )
  );
}
