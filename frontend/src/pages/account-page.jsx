/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useStore from "../store/index";
import { FaBtc, FaPaypal } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import { GiCash } from "react-icons/gi";
import api from "../libs/apiCall"; // Adjust the path if your api file is located elsewhere
import { toast } from "sonner";
import Loading from "../components/ui/loading";
import Title from "../components/ui/title";
import { MdAdd, MdVerifiedUser } from "react-icons/md";
import { formatCurrency, maskAccountNumber } from "../libs";
import AccountMenu from "../components/ui/accountDialog";
import AddAccount from "../components/ui/AddAccount";
import AddMoney from "../components/ui/AddMoney";
import TransferMoney from "../components/ui/transferMoney";

const ICONS = {
  crypto: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  "visa debit card": (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),
  paypal: (
    <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  ),
};
const getIcon = (name) => {
  const lowered = name?.toLowerCase();
  if (lowered.includes("crypto")) return ICONS.crypto;
  if (lowered.includes("visa")) return ICONS["visa debit card"];
  if (lowered.includes("mastercard")) return ICONS.mastercard;
  if (lowered.includes("paypal")) return ICONS.paypal;
  if (lowered.includes("cash")) return ICONS.cash;
  return (
    <div className="w-12 h-12 bg-gray-400 text-white flex items-center justify-center rounded-full">
      ?
    </div>
  );
};

const AccountPage = () => {
  const { user } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get("/account");
      setData(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleTransfer = (account) => {
    setSelectedAccount(account.id);
    setIsOpenTransfer(true);
  };
  const handleOpenAddMoney = (account) => {
    setSelectedAccount(account.id);
    setIsOpenTopup(true);
  };

  return (
    <>
      <div className="w-full py-10">
        <div className="flex items-center justify-between">
          <Title title={"Account Information"} />
          <div className="flex items-center gap-4 my-8">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center gap-2 border rounded-2xl
              px-2 py-1.5 bg-black text-white hover:bg-violet-600
               dark:bg-violet-600  dark:text-white hover:shadow-lg shadow-lg dark:hover:bg-white-100 dark:hover:text-black"
            >
              <MdAdd size={26} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {data.length == 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No accounts found. Please add an account to manage your finances.
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6 py-10">
            {data?.map((account, index) => (
              <div
                key={index}
                className="w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg shadow"
              >
                <div>{getIcon(account?.account_name)}</div>

                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-black dark:text-gray-400 text-lg">
                        {account?.account_name}
                      </p>
                      <MdVerifiedUser
                        size={20}
                        className="text-emerald-600 ml-1"
                      />
                    </div>
                    <AccountMenu
                      className=""
                      addMoney={() => handleOpenAddMoney(account)}
                      transferMoney={() => handleTransfer(account)}
                    />
                  </div>

                  <span className="dark:text-gray-400  text-gray-600">
                    {maskAccountNumber(account.account_number)}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-500">
                    {account?.createdat
                      ? new Date(account.createdat).toLocaleDateString(
                          "en-US",
                          {
                            dateStyle: "full",
                          }
                        )
                      : "Unknown"}
                  </p>
                  <div className="flex align-center justify-between ">
                    <p className="text-xl text-gray-600 dark:text-gray-500 font font-medium">
                      {formatCurrency(account?.account_balance)}
                    </p>
                    <button
                      onClick={() => handleOpenAddMoney(account)}
                      className="text-xs hover:underline text-gray-600 dark:text-gray-500 "
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddAccount
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refetch={fetchAccounts}
        key={new Date().getTime()}
      />

      <AddMoney
        isOpen={isOpenTopup}
        setIsOpen={setIsOpenTopup}
        refetch={fetchAccounts}
        key={new Date().getTime()}
        id={selectedAccount}
      />

      <TransferMoney
        isOpen={isOpenTransfer}
        setIsOpen={setIsOpenTransfer}
        refetch={fetchAccounts}
        id={selectedAccount}
      />
    </>
  );
};

export default AccountPage;
