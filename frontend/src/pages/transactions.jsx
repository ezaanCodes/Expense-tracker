/* eslint-disable no-unused-vars */
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
            {/* <DateRange /> */}

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
              className="py-1.5 px-2 rounded text-white bg-black dark:bg-violet-800 
              flex items-center justify-center gap-2 border: rounded-md p-2"
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
      </div>
    </>
  );
};

export default Transactions;
