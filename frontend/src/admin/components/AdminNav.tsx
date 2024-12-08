import React from "react";
import { NavLink } from "react-router-dom";

function AdminNav() {
  return (
    <div className="flex content-center justify-center h-screen w-40  ml-1">
      <div className=" h-72 my-auto w-32">
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Dahboard</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Patients</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="/adminDoctors">Doctors</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Payments</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Appointments</NavLink>
        </div>
        <div className="h-9  border-[1px] w-32 text-center p-1 m-2 rounded-lg bg-white text-[#007E85] font-extrabold font-2xl">
          <NavLink to="">Signout</NavLink>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
