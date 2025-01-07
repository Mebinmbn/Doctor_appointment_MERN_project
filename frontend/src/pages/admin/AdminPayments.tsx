import React, { useEffect, useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import api from "../../api/api";

interface Payment {
  id: string;
  name: string;
  registered: string;
  role: string;
  status: string;
}

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get(
        "/doctor/payments/6756e293514336528ca8e3a9",
        {
          headers: { "User-Type": "doctor" },
        }
      );
      if (response.data.success) {
        const fetchedPayments = response.data.payments.map((payment: any) => ({
          id: payment._id,
          name: payment.userId.firstName, // Adjust field mapping as per API response
          registered: payment.createdAt, // Format as needed
          role: payment.paymentMethod,
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

  const columns = [
    { key: "id", label: "Transaction ID", _style: { width: "20%" } },
    { key: "name", label: "Name", _style: { width: "25%" } },
    { key: "registered", label: "Registered Date", _style: { width: "20%" } },
    { key: "role", label: "Role", _style: { width: "15%" } },
    { key: "status", label: "Status", _style: { width: "15%" } },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4">Admin Payments</h2>
        {loading ? (
          <p>Loading payments...</p>
        ) : (
          <CSmartTable
            items={payments}
            columns={columns}
            columnFilter
            columnSorter
            pagination
            tableProps={{
              hover: true,
              striped: true,
              responsive: true,
              className: "table-sm",
            }}
          />
        )}
      </div>
    </div>
  );
};
