import { FormEvent, useState } from "react";
import Navbar from "../../components/patient/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

function ForgotPassword() {
  const [userEmail, setUserEmail] = useState("");
  const { setEmail, setUserType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmail(userEmail);

    setUserType("forgotPassword");
    try {
      const response = await axios.post(
        "https://befine.site/api/otp/send",
        {
          email: userEmail,
          userType: "forgotPass_patient",
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.success) {
        console.log(response.data.message);
        toast.success("OTP sent successfully");
        setIsLoading(true);
        navigate("/otp");
      } else {
        console.error("Error response from server:", response.data);
        toast.error(response.data.message || "Error sending OTP");
      }
      setUserEmail("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Email is not registered with us", error.message);
    }
    setUserEmail("");
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen items-center justify-center min-h-screen bg-[#007E85]">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-gray-200 h-72 w-96 text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
            <h1 className="text-2xl font-bold pt-2 pb-2 text-[#007E85]">
              Forgot Password
            </h1>
            <p className="font-thin my-3">Enter your email to get the OTP</p>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 my-2 p-2 font-light focus:outline-none"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email"
              />
              <button
                type="submit"
                className="bg-[#007E85] rounded-lg p-2 mt-4 my-5 text-white w-24 font-bold"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default ForgotPassword;
