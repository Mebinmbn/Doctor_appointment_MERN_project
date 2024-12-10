import React, { useState } from "react";

function ResetPassword() {
  const [password, setPassword] = useState("");

  return (
    <>
      <Navbar />
      <div className="flex h-screen items-center justify-center min-h-screen bg-[#007E85]">
        <div className="bg-gray-200 h-72 w-96 text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
          <h1 className="text-2xl font-bold pt-2 pb-2 text-[#007E85]">
            Forgot Password
          </h1>
          <p className="font-thin my-3">Enter your email to get the OTP</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 my-2 p-2 font-light focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
            />
            <button
              type="submit"
              className="bg-[#007E85] rounded-lg p-2 mt-4 my-5 text-white w-24 font-bold"
            >
              Submit
            </button>
          </form>
        </div>
        .
      </div>
    </>
  );
}

export default ResetPassword;
