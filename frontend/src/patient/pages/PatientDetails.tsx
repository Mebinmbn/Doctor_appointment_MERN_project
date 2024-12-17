import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { User } from "../../types/user";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RootState } from "../../app/store";

interface FormValues {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  houseNo?: string;
  street?: string;
  city?: string;
  pin?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  houseNo?: string;
  street?: string;
  city?: string;
  pin?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

interface RootUser {
  name: string;
  id: string;
  role: string;
}

function PatientDetails() {
  const [patient, setPatient] = useState<User | null>(null);
  const location = useLocation();
  const { selectedDate, selectedTime, doctor } = location.state || {};
  const navigate = useNavigate();
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as RootUser | null;

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);

  const fetchPatientDetails = async () => {
    const id = user?.id;
    console.log("id from fetchPatientDetails", id);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/patients/appointments/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPatient(response.data.patient);
        console.log(
          "data fetched successfully",
          response.data.patient,
          patient
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(selectedDate, selectedTime);
  useEffect(() => {
    if (user) {
      fetchPatientDetails();
    }
  }, []);

  console.log("user form patientDetails", user, patient);

  const initialValues: FormValues = {
    userId: patient?._id,
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    email: patient?.email,
    phone: patient?.phone,
    gender: patient?.gender,
    dob: patient?.dob?.toString().slice(0, 10),
    houseNo: "",
    street: "",
    city: "",
    pin: "",
  };

  console.log("initialValues", initialValues);

  //   const { setEmail, setUserType } = useAuth();
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (patient) {
      setFormData({
        userId: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        dob: patient.dob?.toString().slice(0, 10),
        houseNo: "",
        street: "",
        city: "",
        pin: "",
      });
    }
  }, [patient]);

  const token = localStorage.getItem("adminToken");
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^[6-9]\d{9}$/;
  const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const pinRegex = /^[1-9][0-9]{5}$/;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
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

    if (!values.dob) {
      errors.dob = "DOB is required";
    } else if (!dobRegex.test(values.dob)) {
      errors.dob = "Not a valid dob";
    }

    if (!values.houseNo) {
      errors.houseNo = "House No. is required";
    }

    if (!values.street) {
      errors.street = "Street is required";
    }

    if (!values.city) {
      errors.city = "City is required";
    }

    if (!values.pin) {
      errors.pin = "Pin is required";
    } else if (!pinRegex.test(values.pin)) {
      errors.pin = "Invalid pin";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        // setEmail(formData.email);
        // setUserType("doctor");

        console.log(formData);

        const response = await axios.post(
          "http://localhost:8080/api/patients/appointments/patient",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          toast.success("Patient's details stored successfully");
          navigate("/paymentPage", {
            state: { selectedDate, selectedTime, formData, doctor },
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error in signup request:", axiosError);

        toast.error(axiosError.response?.data.error);
      }
    }
  };
  return (
    <div className="bg-[#007E85] h-screen">
      <Navbar />
      <div className="bg-white  mx-auto w-10/12  p-6 rounded-lg mt-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
        <div className="flex  justify-center  bg-gray-200 mb-4">
          <form
            onSubmit={handleSubmit}
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
                <InputField
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="dob(YYYY-MM-DD)"
                />
                {formErrors.dob && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>
                )}
              </div>
              <div className="form-group">
                <InputField
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  placeholder="House No/ House Name"
                />
                {formErrors.houseNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.houseNo}
                  </p>
                )}
              </div>
              <div className="form-group">
                <InputField
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Street"
                />
                {formErrors.street && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.street}
                  </p>
                )}
              </div>
              <div className="form-group">
                <InputField
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>
              <div className="form-group">
                <InputField
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  placeholder="Pin"
                />
                {formErrors.pin && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.pin}</p>
                )}
              </div>
            </div>

            <div className="mt-6 text-right">
              <button className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;

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
