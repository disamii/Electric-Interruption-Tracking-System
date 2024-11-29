import React from "react";

import LoginForm from "../component/forms/LoginForm";
import whiterbg from "../assets/images/whiterbg.jpg";
import ImageDisplayer from "../component/UI/ImageDisplayer";



export default function LoginPage() {
  return (
    <main className="main ">
      <ImageDisplayer />
      <div className="flex-1 flex  justify-center items-center">
        <div className=" flex  justify-center items-center flex-col">
          <figure className=" w-[25rem] text-center ">
            <img src={whiterbg} alt="" className="h-full w-full" />
          </figure>
          <LoginForm />
          <div className=" text-right mr-[1rem] ml-auto">
            <small>dont you have account?</small> <br />
            <small>contact admin</small>
          </div>
        </div>
      </div>
    </main>
  );
}
