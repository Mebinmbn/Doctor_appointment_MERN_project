import { useEffect, useState } from "react";
import PatientSideBar from "../../components/patient/PatientSideBar";
import PatientTopBar from "../../components/patient/PatientTopBar";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const user = useSelector((state: RootState) => state.user.user);

  const fetchWallet = async () => {
    try {
      const response = await api.get(`/patients/wallet/${user?.id}`);
      if (response.data.success) {
        setBalance(response.data.wallet.balance);
        const transactions = response.data.wallet.transactions.map(
          (transaction: Transaction) => ({
            ...transaction,
            date: new Date(transaction.date),
          })
        );
        transactions.sort(
          (a: Transaction, b: Transaction) =>
            b.date.getTime() - a.date.getTime()
        );
        setTransactions(transactions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="md:flex items-center justify-center min-h-screen bg-[#007E85] gap-5">
      <PatientSideBar />
      <div className="bg-white h-fit min-h-[98vh] w-full md:w-[88vw] text-center p-6 md:rounded-l-[4rem] drop-shadow-xl border-[1px] border-[#007E85] ml-auto md:me-2">
        <PatientTopBar />
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Wallet Balance</h2>
          <div className="text-4xl font-bold mb-4">₹{balance.toFixed(2)}</div>
          <h3 className="text-xl font-bold mb-2">Transactions</h3>
          <ul>
            {transactions.length === 0 && (
              <p className="text-red-500">No transactions found</p>
            )}
            {currentTransactions.map((transaction) => (
              <li key={transaction.id} className="mb-2 p-2 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.date.toISOString().slice(0, 10)}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      transaction.description === "Debit"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.description === "Debit" ? "-" : "+"}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {transactions.length > transactionsPerPage && (
            <Pagination
              transactionsPerPage={transactionsPerPage}
              totalTransactions={transactions.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface PaginationProps {
  transactionsPerPage: number;
  totalTransactions: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination = ({
  transactionsPerPage,
  totalTransactions,
  paginate,
  currentPage,
}: PaginationProps) => {
  const pageNumbers = [];

  for (
    let i = 1;
    i <= Math.ceil(totalTransactions / transactionsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex list-none">
          {pageNumbers.map((number) => (
            <li key={number} className="mr-2">
              <button
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded ${
                  currentPage === number
                    ? "bg-[#007E85] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Wallet;
