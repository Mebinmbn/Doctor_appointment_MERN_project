import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PatientSideBar from "../../components/patient/PatientSideBar";
import api from "../../api/api";
import { User } from "../../types/user";
import PatientTopBar from "../../components/patient/PatientTopBar";

interface FormValues {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  password?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  currentpass?: string;
  password?: string;
}

interface AxiosError {
  response?: {
    data: {
      error?: string;
    };
  };
}

function Profile() {
  const [patient, setPatient] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormValues>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      navigate("/login");
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
    }
  }, [user, navigate]);
  const fetchPatientDetails = useCallback(async () => {
    const id = user?.id;

    try {
      const response = await api.get(`/patients/patient/${id}`, {
        headers: { "User-Type": "patient" },
      });
      if (response.data.success) {
        setPatient(response.data.patient);
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);
  useEffect(() => {
    if (user) {
      fetchPatientDetails();
    }
  }, [fetchPatientDetails, user]);
  useEffect(() => {
    if (patient) {
      const initialValues: FormValues = {
        _id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        dob: patient.dob?.toString().slice(0, 10),
        password: "",
      };
      setFormData(initialValues);
    }
  }, [patient]);

  const verifyCurrentPassword = async () => {
    try {
      const response = await api.post(
        "/patients/verifyPassword",
        {
          currentPassword,
          email: patient?.email,
        },
        {
          headers: { "User-Type": "patient" },
        }
      );
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^[6-9]\d{9}$/;
  const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
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

    if (currentPassword) {
      if (!values.password) {
        errors.password = "Enter the new password";
      }
    }
    if (values.password) {
      if (!currentPassword) {
        errors.currentpass = "Enter current password";
      }
      if (!passwordRegex.test(values.password)) {
        errors.password =
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.";
      }
    }
    return errors;
  };
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);

    if (currentPassword) {
      const isValidPassword = await verifyCurrentPassword();
      if (!isValidPassword) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          currentpass: "Incorrect current password.",
        }));
        return;
      }
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await api.put("/patients/patient", formData, {
          headers: { "User-Type": "patient" },
        });
        if (response.data.success) {
          toast.success("Patient's details updated successfully");
          setCurrentPassword("");
          formData.password = "";
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        toast.error(axiosError.response?.data.error);
      }
    }
  };

  useEffect(() => {
    setCurrentPassword("");
  }, []);
  return (
    <div className="  md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <PatientSideBar />

      <div className="bg-gray-200 h-fit min-h-screen md:w-[85vw] text-center p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <PatientTopBar />
        <div className="mt-10 mx-auto w-fit h-fit p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <div className="flex  justify-center  bg-gray-200 mb-4">
            <form
              onSubmit={handleUpdate}
              className=" p-6 rounded-lg  w-full max-w-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="form-group">
                  <InputField
                    name="firstName"
                    value={formData.firstName || ""}
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
                    value={formData.lastName || ""}
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
                    value={formData.email || ""}
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
                    value={formData.phone || ""}
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
                    className=" w-full md:w-[19vw] px-3 py-2 border border-[#007E85] font-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.dob || ""}
                    onChange={handleChange}
                    placeholder="dob(YYYY-MM-DD)"
                  />
                  {formErrors.dob && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.dob}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-b border-2 w-full border-gray-100 mt-5 b-2"></div>
              <p className="mb-2">Change Password</p>
              <div className="my-2">
                <PassField
                  name="currentPassword"
                  value={currentPassword || ""}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />
                {formErrors.currentpass && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.currentpass}
                  </p>
                )}
              </div>
              <div className="form-group w-full">
                <PassField
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <button className="bg-[#007E85] rounded-lg p-2 text-white w-24 font-bold">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
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
      className="border-[1px] border-[#007E85] rounded-lg h-10 w-full md:w-[19vw]  mt-1 p-2 font-light focus:outline-none"
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
      className="border-[1px] border-[#007E85] rounded-lg h-10 w-full md:w-[19vw]  p-2 font-light focus:outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <p className="font-thin text-red-400 text-sm p-0 m-0">{error}</p>
  </>
);
