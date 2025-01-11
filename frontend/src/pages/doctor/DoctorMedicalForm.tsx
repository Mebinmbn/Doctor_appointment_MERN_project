import { useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import api from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

interface ErrorResponse {
  error: string;
}

interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  period: string;
}

const MedicalForm = () => {
  const [symptoms, setSymptoms] = useState<string[]>([""]);
  const [diagnosis, setDiagnosis] = useState<string[]>([""]);
  const [tests, setTests] = useState<string[]>([""]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { medicine: "", dosage: "", frequency: "", period: "" },
  ]);
  const [advice, setAdvice] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = location.state || { roomId: null };

  const addField = (
    setField: React.Dispatch<React.SetStateAction<string[]>>,
    field: string[]
  ) => {
    setField([...field, ""]);
  };
  const addPrescriptionField = () => {
    setPrescriptions([
      ...prescriptions,
      { medicine: "", dosage: "", frequency: "", period: "" },
    ]);
  };
  const removeField = (
    setField: React.Dispatch<React.SetStateAction<string[] | Prescription[]>>,
    field: string[] | Prescription[],
    index: number
  ) => {
    const updatedField = [...field];
    updatedField.splice(index, 1);
    setField(updatedField);
  };
  const handleFieldChange = (
    setField: React.Dispatch<React.SetStateAction<string[]>>,
    field: string[],
    index: number,
    value: string
  ) => {
    const updatedField = [...field];
    updatedField[index] = value;
    setField(updatedField);
  };
  const handlePrescriptionChange = (
    index: number,
    key: keyof Prescription,
    value: string
  ) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][key] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post(
        "/doctor/medicalRecord",
        {
          appointmentId: roomId,
          symptoms,
          diagnosis,
          tests,
          prescriptions,
          advice,
        },
        {
          headers: { "User-Type": "doctor" },
        }
      );
      if (response.data.success) {
        toast.success("Medical Record Updated Successfully");
        navigate("/doctor/appointments");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.error("Error in signup request:", axiosError);
      toast.error(axiosError.response?.data.error);
    }
  };

  return (
    <div className="flex bg-[#007E85] min-h-screen">
      <DoctorNav />
      <div className="max-w-4xl  my-10 mx-auto p-6 bg-white rounded-lg shadow-xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#007E85] border-b-2 pb-4">
          Medical Form
        </h1>

        <div className="form-group mb-8">
          <h2 className="text-xl font-semibold text-[#007E85] underline mb-4">
            Symptoms
          </h2>
          {symptoms.map((symptom, index) => (
            <div
              key={index}
              className="field-group mb-4 flex items-center gap-4"
            >
              <input
                type="text"
                value={symptom}
                onChange={(e) =>
                  handleFieldChange(
                    setSymptoms,
                    symptoms,
                    index,
                    e.target.value
                  )
                }
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder={`Symptom ${index + 1}`}
              />
              <button
                onClick={() => removeField(setSymptoms, symptoms, index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setSymptoms, symptoms)}
            className="mt-2 px-4 py-2 bg-[#007E85] text-white rounded-lg shadow hover:bg-[#005F63] flex items-center justify-center gap-2"
          >
            <FaPlus /> Add More
          </button>
        </div>

        <div className="form-group mb-8">
          <h2 className="text-xl font-semibold text-[#007E85] underline mb-4">
            Diagnosis
          </h2>
          {diagnosis.map((diag, index) => (
            <div
              key={index}
              className="field-group mb-4 flex items-center gap-4"
            >
              <input
                type="text"
                value={diag}
                onChange={(e) =>
                  handleFieldChange(
                    setDiagnosis,
                    diagnosis,
                    index,
                    e.target.value
                  )
                }
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder={`Diagnosis ${index + 1}`}
              />
              <button
                onClick={() => removeField(setDiagnosis, diagnosis, index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setDiagnosis, diagnosis)}
            className="mt-2 px-4 py-2 bg-[#007E85] text-white rounded-lg shadow hover:bg-[#005F63] flex items-center justify-center gap-2"
          >
            <FaPlus /> Add More
          </button>
        </div>

        <div className="form-group mb-8">
          <h2 className="text-xl font-semibold text-[#007E85] underline mb-4">
            Tests
          </h2>
          {tests.map((test, index) => (
            <div
              key={index}
              className="field-group mb-4 flex items-center gap-4"
            >
              <input
                type="text"
                value={test}
                onChange={(e) =>
                  handleFieldChange(setTests, tests, index, e.target.value)
                }
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder={`Test ${index + 1}`}
              />
              <button
                onClick={() => removeField(setTests, tests, index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(setTests, tests)}
            className="mt-2 px-4 py-2 bg-[#007E85] text-white rounded-lg shadow hover:bg-[#005F63] flex items-center justify-center gap-2"
          >
            <FaPlus /> Add More
          </button>
        </div>

        <div className="form-group mb-8">
          <h2 className="text-xl font-semibold text-[#007E85] underline mb-4">
            Prescriptions
          </h2>
          {prescriptions.map((prescription, index) => (
            <div
              key={index}
              className="field-group mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                value={prescription.medicine}
                onChange={(e) =>
                  handlePrescriptionChange(index, "medicine", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder="Medicine"
              />
              <input
                type="text"
                value={prescription.dosage}
                onChange={(e) =>
                  handlePrescriptionChange(index, "dosage", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder="Dosage"
              />
              <input
                type="text"
                value={prescription.frequency}
                onChange={(e) =>
                  handlePrescriptionChange(index, "frequency", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder="Frequency"
              />
              <input
                type="text"
                value={prescription.period}
                onChange={(e) =>
                  handlePrescriptionChange(index, "period", e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                placeholder="Period"
              />
            </div>
          ))}
          <div className="flex items-center gap-4 ">
            <button
              onClick={() =>
                removeField(
                  setPrescriptions,
                  prescriptions,
                  prescriptions.length - 1
                )
              }
              className="px-4 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              <FaTrash />
            </button>
            <button
              onClick={addPrescriptionField}
              className=" px-4 py-2 bg-[#007E85] text-white rounded-lg shadow hover:bg-[#005F63] flex items-center justify-center gap-2"
            >
              <FaPlus /> Add More
            </button>
          </div>
        </div>

        <div className="form-group mb-8">
          <h2 className="text-xl font-semibold text-[#007E85] underline mb-4">
            Advice
          </h2>
          <textarea
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Provide advice..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-[#007E85]"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            className="px-6 py-3 bg-[#007E85] text-white rounded-lg shadow hover:bg-[#005F63]"
            onClick={handleUpdate}
          >
            Update Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalForm;
