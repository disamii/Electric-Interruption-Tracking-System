import React, {  useState } from "react";
import Header from "../component/Header";
import { Outlet } from "react-router-dom";
import PasswordChanger from "./PasswordChanger";

export default function Home() {

  const [ispasswordchange, setchanger] = useState({
    suggestChange:false,
    isSuccessfull:false
  });
 

  const onclickHandler = (value) => {
    setchanger((prev)=>({...prev,suggestChange:value}));
  };
const SuccessfullyChangedHandler=()=>{
  setchanger((prev)=>({...prev,isSuccessfull:true,suggestChange:true}));

}
  return (
    <section
      className= " overflow-hidden h-[100vh] "
    >
      {ispasswordchange.suggestChange && !ispasswordchange.isSuccessfull&&<PasswordChanger onclickHandler={onclickHandler} onSuccess={SuccessfullyChangedHandler}/>}
      <Header onclickHandler={onclickHandler} ispasswordchange={ispasswordchange}/>
      <main className=" overflow-y-scroll max-h-[90vh] ">
        <div className=" p-[2rem] mb-[5rem]">
          <Outlet />
        </div>
      </main>
    </section>
  );
}
