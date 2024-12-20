import { FormEvent, useState } from "react";
import Navbar from "../../components/patient/Navbar";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const { email } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/patients/reset", { password, email });

      if (response.data.success) {
        navigate("/login");
        toast.success("Password changed successfully, please login");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error);
      console.log("Password reset error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen items-center justify-center min-h-screen bg-[#007E85]">
        <div className="bg-gray-200 h-72 w-96 text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
          <h1 className="text-2xl font-bold pt-2 pb-2 text-[#007E85]">
            Reset Password
          </h1>
          <p className="font-thin my-3">Enter your new password</p>
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
