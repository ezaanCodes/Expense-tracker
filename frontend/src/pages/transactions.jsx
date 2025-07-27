import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/apiCall";
import Loading from "../components/ui/loading";
import Title from "../components/ui/title";
import { IoSearchOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { exportToExcel } from "react-json-to-excel";
import DateRange from "../components/ui/dateRange";
import { formatCurrency } from "../libs";
import { TiWarning } from "react-icons/ti";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import ViewTransaction from "../components/ui/viewTransactions";
import AddTransaction from "../components/ui/addTransaction";

const Transactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";

  const handleViewTransaction = (transaction) => {
    setSelected(transaction);
    setIsOpenView(true);
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const URL = `transaction?df=${startDate}&dt=${endDate}&s=${search}`;
      const { data: res } = await api.get(URL);

      setData(res?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error fetching transactions:", error);
      if (error?.response?.data?.status === "auth failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchParams({ df: startDate, dt: endDate, s: search });
    await fetchTransactions();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [startDate, endDate, searchParams]);

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="w-full pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <Title title="Transactions" />

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <DateRange />

            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                <IoSearchOutline className="text-xl text-gray-600 dark:text-gray-500" />
                <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none group bg-transparent text-gray-700 dark:text-gray-400
                  rounded-md px-2 py-2"
                />
              </div>
            </form>
            <button
              onClick={() => {
                setIsOpen(true);
              }}
              className="py-1.5 px-2 text-white bg-black dark:bg-violet-800 
              flex items-center justify-center gap-2 border: rounded-md p-2 hover:bg-violet-800 dark:hover:bg-slate-100 dark:hover:text-black"
            >
              <MdAdd size={22} />
              <span> Pay </span>
            </button>

            <button
              onClick={() => {
                exportToExcel(data, `Transactions ${startDate}-${endDate}`);
              }}
              className="flex items-center gap-2 text-black dark:text-gray-300"
            >
              Export <CiExport size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-5 pb-10">
          {data?.length === 0 ? (
            <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
              <span> No transaction History</span>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="w-full border-b border-gray-300 dark:border-gray-700">
                  <tr className="w-full text-black dark:text-gray-400 text-left">
                    <th className="py-2"> Date</th>
                    <th className="py-2 px-2"> Description</th>
                    <th className="py-2 px-2"> Status</th>
                    <th className="py-2 px-2"> Source</th>
                    <th className="py-2 px-2"> Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="w-full border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:bg-gray-50"
                      >
                        <td className="py-4">
                          <p className="w-24 md:w-auto">
                            {new Date(item.createdat).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex flex-col w-56 md:w-auto">
                            <p className="text-base 2xl:text-lg text-black dark:text-gray-400 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <p className="text-base 2xl:text-lg text-black dark:text-gray-400 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            {item.status === "Pending" && (
                              <RiProgress3Line
                                className="text-amber-500"
                                size={24}
                              />
                            )}
                            {item.status === "Completed" && (
                              <IoCheckmarkDoneCircle
                                className="text-emerald-600"
                                size={24}
                              />
                            )}
                            {item.status === "Rejected" && (
                              <TiWarning className="text-red-500" size={24} />
                            )}
                            <span>{item?.status}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">{item?.source}</td>

                        <td className="py-4 text-black dark:text-gray-400 text-base font-medium">
                          <span
                            className={
                              item?.type === "income"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }
                          >
                            {item?.type === "income" ? "+" : "-"}
                          </span>
                          {formatCurrency(item?.amount)}
                        </td>

                        <td className="py-4 px-2">
                          <button
                            onClick={() => handleViewTransaction(item)}
                            className="outline-none text-violet-600 hover:underline"
                          >
                            view
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <AddTransaction
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchTransactions}
        key={new Date().getTime()}
      />

      <ViewTransaction
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
        data={selected}
      />
    </>
  );
};

export default Transactions;
