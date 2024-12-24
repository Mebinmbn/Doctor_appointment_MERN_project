import { useState, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch } from "react-redux";
import { setDoctor } from "../../app/featrue/doctorSlice";
import { AppDispatch } from "../../app/store";
import api from "../../api/api";
import axios from "axios";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

function DoctorSignin() {
  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  };

  const { setEmail, setUserType } = useAuth();
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const validateSigninData = (email: string, password: string) => {
    const errors: FormErrors = {};
    if (!email) {
      errors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!password) {
      errors.password = "Password is required!";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }
    return errors;
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateSigninData(formData.email, formData.password);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        setEmail(formData.email);
        const email = formData.email;
        const password = formData.password;
        setUserType("doctor");

        const response = await api.post("/doctor/signin", { email, password });
        console.log(response.data.success);
        if (response.data.success === true) {
          const { user, token } = response.data;
          console.log(user);
          dispatch(
            setDoctor({
              doctor: {
                id: user.id,
                name: user.name,
                role: user.role,
                isApproved: user.isApproved,
              },
              doctorToken: token,
            })
          );
          localStorage.setItem("doctorToken", token);
          if (user.isApproved) {
            navigate("/doctor");
            toast.success("Logged in Successfully");
          } else {
            toast.error("Application not approved yet");
          }
        }

        setFormData(initialValues);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(
          "Error in signin request:",
          axiosError.response?.data.error
        );
        toast.error(axiosError.response?.data.error);
        if (
          axiosError.response?.data.error === "Error: Email is not verified"
        ) {
          const response = await axios.post(
            "http://localhost:8080/api/otp/send",
            { email: formData.email },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          if (response.data.success) navigate("/otp");
          setFormData(initialValues);
        }

        setFormData(initialValues);
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <div className="bg-gray-200 h-[20rem] w-96 text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
        <h1 className="text-2xl font-bold pt-2 pb-2 text-[#007E85]">
          Doctor Sign In
        </h1>
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            name="email"
            className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 my-2 p-2 font-light focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <p className=" text-red-500 text-xs p-0 m-0">{formErrors?.email}</p>

          <input
            type="password"
            name="password"
            className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 mt-1 p-2 font-light focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <p className=" text-red-500 text-xs p-0 m-0">
            {formErrors?.password}
          </p>
          <button className="bg-[#007E85] rounded-lg p-2 mt-4 my-5 text-white w-24 font-bold">
            Sign In
          </button>
        </form>
        <p>
          Want to register?
          <span
            onClick={() => {
              navigate("/doctor/signup");
            }}
            className="text-blue-400 text-sm cursor-pointer"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default DoctorSignin;
