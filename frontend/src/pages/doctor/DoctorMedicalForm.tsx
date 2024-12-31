import React, { useState } from "react";
import DoctorNav from "../../components/doctor/DoctorNav";
import api from "../../api/api";

const MedicalForm = () => {
  const [symptoms, setSymptoms] = useState([""]);
  const [diagnosis, setDiagnosis] = useState([""]);
  const [tests, setTests] = useState([""]);
  const [advice, setAdvice] = useState("");

  const addField = (setField, field) => {
    setField([...field, ""]);
  };

  const handleFieldChange = (setField, field, index, value) => {
    const updatedField = [...field];
    updatedField[index] = value;
    setField(updatedField);
  };

  const handleUpdate = async () => {
    try {
      const response = await api.post("/doctor/medicalRecord", {
        symptoms,
        diagnosis,
        tests,
        advice,
      });
    } catch (error) {
      console.log(error);
    }
    console.log({
      symptoms,
      diagnosis,
      tests,
      advice,
    });
  };

  return (
    <div className="flex bg-[#007E85]">
      <DoctorNav />
      <div className="max-w-5xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Medical Form</h1>

        <div className="form-group mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Symptoms
          </label>
          {symptoms.map((symptom, index) => (
            <div key={index} className="field-group mb-2 flex">
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
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Symptom ${index + 1}`}
              />
              {index === symptoms.length - 1 && (
                <button
                  onClick={() => addField(setSymptoms, symptoms)}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add More
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Diagnosis
          </label>
          {diagnosis.map((diag, index) => (
            <div key={index} className="field-group mb-2 flex">
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
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Diagnosis ${index + 1}`}
              />
              {index === diagnosis.length - 1 && (
                <button
                  onClick={() => addField(setDiagnosis, diagnosis)}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add More
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Tests
          </label>
          {tests.map((test, index) => (
            <div key={index} className="field-group mb-2 flex">
              <input
                type="text"
                value={test}
                onChange={(e) =>
                  handleFieldChange(setTests, tests, index, e.target.value)
                }
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Test ${index + 1}`}
              />
              {index === tests.length - 1 && (
                <button
                  onClick={() => addField(setTests, tests)}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add More
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Advice
          </label>

          <textarea
            name="advice"
            id=""
            value={advice}
            placeholder="Advice..."
            onChange={(e) => {
              setAdvice(e.target.value);
            }}
            className="flex-grow w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="form-group mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Next Appointment
          </label>
        </div>

        <div className="flex justify-end">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalForm;
