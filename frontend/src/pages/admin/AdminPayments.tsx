import React, { useEffect, useState } from "react";
import api from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminTopBar from "../../components/admin/AdminTopBar";
import AdminNav from "../../components/admin/AdminNav";

interface Payment {
  id: string;
  name: string;
  doctor: string;
  registered: string;
  method: string;
  amount: number;
  status: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment;
    direction: "asc" | "desc";
  } | null>(null);

  const itemsPerPage = 8;

  const fetchPayments = async () => {
    try {
      const response = await api.get("/admin/payments", {
        headers: { "User-Type": "admin" },
      });
      if (response.data.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fetchedPayments = response.data.payments.map((payment: any) => ({
          id: payment._id,
          name: payment.userId?.firstName || "N/A",
          doctor: `Dr ${payment.doctorId?.firstName || "Unknown"}`,
          registered: payment.createdAt.toString().slice(0, 10),
          method: payment.paymentMethod,
          amount: parseFloat(payment.amount) || 0,
          status: payment.paymentStatus,
        }));
        setPayments(fetchedPayments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSort = (key: keyof Payment) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedPayments = [...payments].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setPayments(sortedPayments);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <AdminNav />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center md:p-6 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <AdminTopBar />
        <div className="flex items-center justify-center min-h-fit">
          <div className="shadow-lg rounded-lg p-4 w-full max-w-6xl text-black">
            <h2 className="text-2xl font-bold mb-4 text-[#007E85]">Payments</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-300">
                  <thead className="bg-gray-500 text-white">
                    <tr>
                      <th
                        className="p-3 cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        Transaction ID{" "}
                        {sortConfig?.key === "id"
                          ? sortConfig.direction === "asc"
                            ? "🔼"
                            : "🔽"
                          : ""}
                      </th>
                      <th
                        className="p-3 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Name{" "}
                        {sortConfig?.key === "name"
                          ? sortConfig.direction === "asc"
                            ? "🔼"
                            : "🔽"
                          : ""}
                      </th>
                      <th
                        className="p-3 cursor-pointer"
                        onClick={() => handleSort("doctor")}
                      >
                        Doctor{" "}
                        {sortConfig?.key === "doctor"
                          ? sortConfig.direction === "asc"
                            ? "🔼"
                            : "🔽"
                          : ""}
                      </th>
                      <th
                        className="p-3 cursor-pointer"
                        onClick={() => handleSort("registered")}
                      >
                        Registered Date{" "}
                        {sortConfig?.key === "registered"
                          ? sortConfig.direction === "asc"
                            ? "🔼"
                            : "🔽"
                          : ""}
                      </th>
                      <th className="p-3">Payment Method</th>
                      <th
                        className="p-3 cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        Amount{" "}
                        {sortConfig?.key === "amount"
                          ? sortConfig.direction === "asc"
                            ? "🔼"
                            : "🔽"
                          : ""}
                      </th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPayments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-3">{payment.id}</td>
                        <td className="p-3">{payment.name}</td>
                        <td className="p-3">{payment.doctor}</td>
                        <td className="p-3">{payment.registered}</td>
                        <td className="p-3">{payment.method}</td>
                        <td className="p-3">₹{payment.amount.toFixed(2)}</td>
                        <td className="p-3">{payment.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center gap-2 items-center mt-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
