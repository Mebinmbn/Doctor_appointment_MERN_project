import React, { useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import api from "../../api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminTopBar from "../../components/admin/AdminTopBar";
import AdminNav from "../../components/admin/AdminNav";

interface Payment {
  id: string;
  name: string;
  registered: string;
  method: string;
  status: string;
}

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/admin/payments", {
        headers: { "User-Type": "admin" },
      });
      if (response.data.success) {
        const fetchedPayments = response.data.payments.map((payment: any) => ({
          id: payment._id,
          name: payment.userId.firstName,
          registered: payment.createdAt.toString().slice(0, 10),
          method: payment.paymentMethod,
          amount: payment.amount,
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

  const columns = React.useMemo(
    () => [
      { Header: "Transaction ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Registered Date", accessor: "registered" },
      { Header: "Payment Method", accessor: "method" },
      { Header: "Amount", accessor: "amount" },
      { Header: "Status", accessor: "status" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data: payments,
      initialState: { pageIndex: 0, pageSize: 8 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85]">
      <AdminNav />
      <div className="bg-white h-[98vh] w-[88vw] text-center p-4 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
        <AdminTopBar />
        <div className="flex items-center justify-center min-h-fit">
          <div className="shadow-lg rounded-lg p-4 w-full max-w-6xl text-center text-black">
            <h2 className="text-2xl font-bold mb-4 text-[#007E85]">Payments</h2>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="table-responsive">
                <table
                  {...getTableProps()}
                  className="table table-bordered table-hover w-full"
                >
                  <thead className="bg-[#007E85] text-white">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            className="p-3"
                            style={{ width: `${100 / columns.length}%` }}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="p-3">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="pagination mt-4 bg-[#007E85] h-fit p-1 text-white">
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="btn btn-secondary me-2 border-2 rounded-lg p-1"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="btn btn-secondary me-2 border-2 rounded-lg px-4 py-1"
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
