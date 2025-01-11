import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  TableInstance,
  Column,
} from "react-table";
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

type TableInstanceWithExtensions<T extends object> = TableInstance<T> & {
  page: T[];
  canNextPage: boolean;
  canPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareRow: (row: any) => void;
};

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/admin/payments", {
        headers: { "User-Type": "admin" },
      });
      if (response.data.success) {
        const fetchedPayments: Payment[] = response.data.payments.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payment: any) => ({
            id: payment._id,
            name: payment.userId?.firstName || "N/A",
            doctor: `Dr ${payment.doctorId?.firstName || "Unknown"}`,
            registered: payment.createdAt.toString().slice(0, 10),
            method: payment.paymentMethod,
            amount: payment.amount,
            status: payment.paymentStatus,
          })
        );
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
    (): Column<Payment>[] => [
      { Header: "Transaction ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Doctor", accessor: "doctor" },
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
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
  } = useTable<Payment>(
    {
      columns,
      data: payments,
      initialState: { pageIndex: 0, pageSize: 8 },
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithExtensions<Payment>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <AdminNav />
      <div className="bg-white h-fit min-h-[98vh] w-[88vw] text-center p-6 text-white rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto me-2">
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
                  <thead className="bg-gray-500 text-white">
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
                <div className="pagination mt-4 bg-gray-500 h-fit p-1 text-white">
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
