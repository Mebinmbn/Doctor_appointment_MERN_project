import { useSelector } from "react-redux";
import AdminNav from "../../components/admin/AdminNav";
import { RootState } from "../../app/store";
import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import api from "../../api/api";
import { IPatient } from "./../../../../server/src/models/patientModel";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminTopBar from "../../components/admin/AdminTopBar";

Chart.register(...registerables);

interface TotalCount {
  appointmentCount: number;
  doctorCount: number;
  patientCount: number;
}

interface RevenueData {
  _id: string;
  totalRevenue: number;
}

function AdminDashboard() {
  const admin = useSelector((state: RootState) => state.admin.admin);
  const [totalCount, setTotalCount] = useState<TotalCount>({
    appointmentCount: 0,
    doctorCount: 0,
    patientCount: 0,
  });
  const [newPatients, setNewPatients] = useState<IPatient[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("daily");
  const chartRef = useRef<Chart | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get(
        `/admin/dashboard/${admin?.id}?period=${period}`,
        {
          headers: { "User-Type": "admin" },
        }
      );
      console.log(response.data.data);
      const { totalCount, newPatients, revenueData } = response.data.data;
      setTotalCount(totalCount);
      setNewPatients(newPatients);
      setRevenueData(revenueData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  useEffect(() => {
    if (revenueData.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      const ctx = (
        document.getElementById("revenueChart") as HTMLCanvasElement
      )?.getContext("2d");
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: revenueData.map((item) => item._id),
            datasets: [
              {
                label: "Revenue",
                data: revenueData.map((item) => item.totalRevenue),
                backgroundColor: "rgba(44, 194, 28, 0.51)",
                borderColor: "rgb(11, 75, 24)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [revenueData]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <AdminNav />
      <div className="bg-gray-200 h-fit min-h-[98vh] w-full md:w-[88vw] text-center p-4 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <AdminTopBar />
        <div className="counts flex justify-between max-w-4xl flex-wrap mx-auto gap-12">
          <div className="w-64 h-48 text-white bg-gradient-to-t from-green-300 rounded-lg to-[#007E85] drop-shadow-xl py-10">
            <strong className="text-2xl">All Appointments</strong>
            <p className="font-bold text-5xl mt-5">
              {totalCount.appointmentCount}
            </p>
          </div>
          <div className="w-64 h-48 text-white bg-gradient-to-t from-green-300 rounded-lg to-[#007E85] drop-shadow-xl py-10">
            <strong className="text-2xl">All Doctors</strong>
            <p className="font-bold text-5xl mt-5">{totalCount.doctorCount}</p>
          </div>
          <div className="w-64 h-48 text-white bg-gradient-to-t from-green-300 rounded-lg to-[#007E85] drop-shadow-xl py-10">
            <strong className="text-2xl">All Patients</strong>
            <p className="font-bold text-5xl mt-5">{totalCount.patientCount}</p>
          </div>
        </div>
        <div className="flex max-w-4xl mx-auto mt-10 flex-wrap gap-12">
          <div className="w-full md:w-[65%] bg-white rounded-lg border-gray-100 drop-shadow-lg h-96 p-2">
            <canvas id="revenueChart"></canvas>
            <div className="h-10 mt-4">
              <button
                className="bg-pink-200 rounded-sm px-2 border-2 drop-shadow-lg"
                onClick={() => setPeriod("daily")}
              >
                Daily
              </button>{" "}
              <button
                className="bg-pink-200 rounded-sm px-2 border-2 drop-shadow-lg"
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </button>{" "}
              <button
                className="bg-pink-200 rounded-sm px-2 border-2 drop-shadow-lg"
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </button>{" "}
              <button
                className="bg-pink-200 rounded-sm px-2 border-2 drop-shadow-lg"
                onClick={() => setPeriod("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>
          <div className="border-2 border-gray-100 text-left rounded-lg max-w-xl ml-2 w-full md:w-64 h-96 bg-white p-2 drop-shadow-lg">
            <ul>
              <strong className="ml-2 mb-2">New Patients</strong>
              {newPatients.length <= 0 && (
                <p>No new registrations for this week</p>
              )}
              {newPatients.map((patient, index) => (
                <li
                  key={index}
                  className="border-b-2 p-2 border-gray-100 mt-1 drop-shadow-sm flex"
                >
                  <div className="w-7 h-7 bg-pink-300 rounded-full flex items-center justify-center text-white font-bold">
                    {patient.firstName[0].toUpperCase()}
                  </div>
                  <div className="ml-2">
                    {patient.firstName.toUpperCase()}{" "}
                    {patient.lastName.toUpperCase()}
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
