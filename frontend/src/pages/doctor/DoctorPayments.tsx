import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import DoctorNav from "../../components/doctor/DoctorNav";
import DoctorTopBar from "../../components/doctor/DoctorTopBar";

interface Payment {
  _id: string;
  userId: { firstName: string };
  paymentId: string;
  doctorId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: Date;
}

const DoctorPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchPayments = async () => {
    try {
      const response = await api.get(`/doctor/payments/${doctor?.id}`, {
        headers: { "User-Type": "doctor" },
      });
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const indexOfLastAppointment = currentPage * itemsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - itemsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <DoctorNav />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center md:p-6 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <DoctorTopBar />
        <div className="flex justify-center items-center">
          <div className="w-full max-w-6xl mt-5 shadow-lg rounded-lg bg-[#007E85]">
            <h2 className="text-2xl font-bold mb-4 text-white p-4 border-b">
              Payments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#007E85] border border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-white border-b">
                      Transaction Id
                    </th>
                    <th className="py-2 px-4 text-white border-b">Patient</th>
                    <th className="py-2 px-4 text-white border-b">
                      Payment Method
                    </th>
                    <th className="py-2 px-4 text-white border-b">Amount</th>
                    <th className="py-2 px-4 text-white border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPayments.length > 0 ? (
                    currentPayments.map((payment) => (
                      <tr key={payment._id}>
                        <td className="py-2 pl-8 text-white border-b text-left ">
                          {payment.transactionId}
                        </td>
                        <td className="py-2  text-white border-b  ">
                          {payment.userId.firstName}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {payment.paymentMethod}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          ₹ {Math.ceil(payment.amount - 100)}
                        </td>
                        <td className="py-2 px-4 text-white border-b">
                          {payment.paymentStatus}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 px-4 text-white border-b" colSpan={6}>
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 mb-1 ${
                      currentPage === page
                        ? "bg-blue-500 text-white rounded-full"
                        : "text-black"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPayments;
