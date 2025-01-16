import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  specialization?: string;
  experience: string;
  location: string;
  dob: string;
  licenseImage: File | null;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  specialization?: string;
  experience?: string;
  location?: string;
  dob?: string;
  licenseImage?: string;
  password?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

function DoctorRegister() {
  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    specialization: "",
    experience: "",
    location: "",
    dob: "",
    licenseImage: null,
    password: "",
  };

  const { setEmail, setUserType } = useAuth();
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^[6-9]\d{9}$/;
  const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      console.log(file);
      setFormData((prevData) => ({ ...prevData, licenseImage: file }));
    },
    []
  );

  const validate = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.firstName) {
      errors.firstName = "First name is required!";
    } else if (!nameRegex.test(values.firstName)) {
      errors.firstName = "First name contains invalid characters!";
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required!";
    } else if (!nameRegex.test(values.lastName)) {
      errors.lastName = "Last name contains invalid characters!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!values.phone) {
      errors.phone = "Phone is required!";
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = "Not a valid mobile number";
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
    }

    if (!values.specialization) {
      errors.specialization = "Specialization is required";
    }

    if (!values.experience) {
      errors.experience = "Experience is required";
    }

    if (!values.location) {
      errors.location = "Location is required";
    }

    if (!values.dob) {
      errors.dob = "DOB is required";
    } else if (!dobRegex.test(values.dob)) {
      errors.dob = "Not a valid dob";
    }

    if (!values.licenseImage) {
      errors.licenseImage = "License is required";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    } else if (!passwordRegex.test(values.password)) {
      errors.password =
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
    }

    return errors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setEmail(formData.email);
        setUserType("doctor");

        console.log(formData);

        const response = await api.post("/doctor/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        console.log("Doctor created:", response.data);
        setLoading(true);
        toast.success(
          "Application submitted successfully, please wait for approval"
        );

        await axios.post(
          "https://befine.site/api/otp/send",
          {
            email: formData.email,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setLoading(false);
        const startTime = new Date().getTime();
        localStorage.setItem("otpStartTime", startTime.toString());
        navigate("/otp");
        setFormData(initialValues);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error in signup request:", axiosError);
        if (
          axiosError.response &&
          axiosError.response.data.error ===
            "User already exists with this email"
        ) {
          toast.error(
            "User already exists with this email. Please try logging in."
          );
        } else {
          toast.error(axiosError.response?.data.error);
        }
        setFormData(initialValues);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-gray-200 h-[42rem] w-[50rem] text-center p-4 rounded-lg drop-shadow-xl border-[1px] border-[#007E85]">
            <h1 className="text-2xl font-bold pt-2 pb-2 text-[#007E85]">
              Register
            </h1>

            <div className="flex  justify-center  bg-gray-200 mb-4">
              <form
                onSubmit={handleRegister}
                className=" p-6 rounded-lg  w-full max-w-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <InputField
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-72 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {formErrors.gender && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.gender}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-72 px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Specialization</option>
                      <option value="cardiologist">Cardiologist</option>
                      <option value="dermatologist">Dermatologist</option>
                      <option value="dentist">Dentist</option>
                      <option value="gynecologist">Gynecologist</option>
                      <option value="pediatrician">Pediatrician</option>
                      <option value="psychiatrist">Psychiatrist</option>
                      <option value="oncologist">Oncologist</option>
                      <option value="neurologist">Neurologist</option>
                    </select>
                    {formErrors.specialization && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.specialization}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="experience"
                    />
                    {formErrors.experience && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.experience}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="location"
                    />
                    {formErrors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <InputField
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      placeholder="dob(YYYY-MM-DD)"
                    />
                    {formErrors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.dob}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <PassField
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <label
                    htmlFor="licenseImage"
                    className="block text-gray-700 font-bold mb-2 me-2"
                  >
                    Upload License Image
                  </label>
                  <input
                    type="file"
                    id="licenseImage"
                    name="licenseImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    //   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {formErrors.licenseImage && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.licenseImage}
                  </p>
                )}

                <div className="mt-6 flex justify-center">
                  <button className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold">
                    Apply
                  </button>
                </div>
              </form>
            </div>

            <p>
              Already have an Account?
              <span
                onClick={() => {
                  navigate("/doctor/login");
                }}
                className="text-blue-400 text-sm cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default DoctorRegister;
const InputField = ({
  name,
  value,
  error,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <>
    <input
      type="text"
      name={name}
      className="border-[1px] border-[#007E85] rounded-lg h-10 w-72 mt-1 p-2 font-light focus:outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <p className="font-thin text-red-500 text-xs p-0 m-0">{error}</p>
  </>
);

const PassField = ({
  name,
  value,
  error,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <>
    <input
      type="password"
      name={name}
      className="border-[1px] border-[#007E85] rounded-lg h-10 w-72  p-2 font-light focus:outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <p className="font-thin text-red-400 text-sm p-0 m-0">{error}</p>
  </>
);
