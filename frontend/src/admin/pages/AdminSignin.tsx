import axios from "axios";
import { useState, useCallback, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../app/featrue/userSlice";
import { AppDispatch, RootState } from "../../app/store";

import { User } from "../../types/user";

interface FormValues {
  email: string;

  password: string;
}

interface FormErrors {
  email?: string;

  password?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

function AdminSignin() {
  const initialValues: FormValues = {
    email: "",

    password: "",
  };

  const { setEmail, setUserType } = useAuth();

  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as User | null;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  //   const passwordRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle input changes
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
    }
    // else if (!emailRegex.test(email)) {
    //   errors.email = "This is not a valid email format!";
    // }

    if (!password) {
      errors.password = "Password is required!";
    }
    // else if (!passwordRegex.test(password)) {
    //   errors.password =
    //     "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    // }
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
        setUserType("admin");

        console.log(email, password);

        const response = await axios.post(
          "http://localhost:8080/api/admin/signin",
          { email, password },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log(response);
        if (response.data.success === true) {
          toast.success("Logged in Successfully");
          const { user, token } = response.data;
          dispatch(setUser({ user, token }));
          localStorage.setItem("token", token);
          navigate("/doctorSignin");
        }

        setFormData(initialValues);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(
          "Error in signup request:",
          axiosError.response?.data.error
        );
        toast.error(axiosError.response?.data.error);

        setFormData(initialValues);
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <div className="bg-gray-200 h-[25rem] w-96 text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
        <h1 className="text-2xl font-bold pt-2 pb-2  my-4 text-[#007E85]">
          Admin Sign In
        </h1>
        <form onSubmit={handleSignIn}>
          <input
            type="text"
            name="email"
            className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 mt-1 p-2 my-4 font-light focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <p className=" text-red-500 text-xs p-0 m-0">{formErrors?.email}</p>

          <input
            type="password"
            name="password"
            className="border-[1px] border-[#007E85] rounded-lg h-10 w-80 mt-1 p-2 my-4 font-light focus:outline-none"
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
      </div>
    </div>
  );
}

export default AdminSignin;
