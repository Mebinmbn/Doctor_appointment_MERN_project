import { useEffect, useState } from "react";
import api from "../api/api";
import LoadingSpinner from "./LoadingSpinner";

import MedicalRecordType from "../types/medicalRecord";

interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  period: string;
}

const MedicalRecord = ({ appointmentId }: { appointmentId: string }) => {
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordType | null>(
    null
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/medicalRecord/${appointmentId}`);
        const { medicalRecord, prescriptions } = response.data.data;
        setMedicalRecord(medicalRecord);
        setPrescriptions(prescriptions.prescriptions || []);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      {medicalRecord && (
        <>
          <h2 className="text-2xl font-bold mb-4">Medical Record</h2>
          <p>
            <strong>Appointment ID:</strong>{" "}
            {medicalRecord?.appointmentId.toString()}
          </p>
          <p>
            <strong>Symptoms:</strong>{" "}
            {medicalRecord.symptoms.length > 0
              ? medicalRecord.symptoms.join(", ")
              : "No symptoms recorded"}
          </p>
          <p>
            <strong>Diagnosis:</strong>{" "}
            {medicalRecord.diagnosis.length > 0
              ? medicalRecord.diagnosis.join(", ")
              : "No diagnosis recorded"}
          </p>
          <p>
            <strong>Tests:</strong>{" "}
            {medicalRecord.tests.length > 0
              ? medicalRecord.tests.join(", ")
              : "No tests recorded"}
          </p>
          <p>
            <strong>Advice:</strong> {medicalRecord.advice || "No advice given"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(medicalRecord.createdAt).toLocaleString().slice(0, 10)}
          </p>

          <h3 className="text-xl font-bold mt-6 mb-4">Prescriptions</h3>
          {prescriptions.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Medicine
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Dosage
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Frequency
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Period
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr
                    key={index}
                    className="even:bg-gray-100 hover:bg-gray-200"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.medicine}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.dosage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.frequency}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {prescription?.period}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Medical Records are not yet updated</p>
          )}
        </>
      )}
    </div>
  );
};

export default MedicalRecord;
