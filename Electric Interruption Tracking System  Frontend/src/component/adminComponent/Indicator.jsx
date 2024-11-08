import React from "react";

export default function Indicator() {
  return (
    <div className=" flex justify-between mx-[10rem]  my-[1rem] items-center">
      <div className="text-center bg-[white] p-[0.5rem] rounded-lg shadow-lg">
        <Typography>Basic From</Typography>
        <Radio color="red" name="userform" defaultChecked />
      </div>
      <ArrowRightAltIcon />
      <div className="text-center bg-[white] p-[0.5rem] rounded-lg shadow-lg">
        <Typography>Address</Typography>
        <Radio name="userform" color="blue" />
      </div>
      <ArrowRightAltIcon />
      <div className="text-center bg-[white] p-[0.5rem] rounded-lg shadow-lg">
        <Typography>Role</Typography>
        <Radio name="userform" color="blue" />
      </div>
    </div>
  );
}
