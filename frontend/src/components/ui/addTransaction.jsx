/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatCurrency } from "../../libs";
import DialogWrapper from "../ui/wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import Input from "../ui/input";
import { Button } from "./button";
import api from "../../libs/apiCall";
import { toast } from "sonner";
import Loading from "./loading";
import { MdOutlineWarning } from "react-icons/md";

const AddTransaction = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [accountInfo, setAcccountInfo] = useState([]);

  const submit = async (data) => {
    try {
      setLoading(true);

      const newDate = { ...data, source: accountInfo.account_name };

      const { data: res } = await api.post(
        `/transaction/add-transaction/${accountInfo?.id}`,
        newDate
      );

      if (res?.status === "success") {
        
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Error adding money:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getAcccountBalance = (val) => {
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val
    );
    setAccountBalance(filteredAccount ? filteredAccount?.account_balance : 0);
    setAcccountInfo(filteredAccount);
  };

  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get("/account");
      setAccountData(res?.data);
    } catch (error) {
      console.error("Error :", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel
        className="w-full max-w-md p-6 transform overflow-hidden bg-white rounded-2xl 
        dark:bg-slate-800 text-left align-middle shadow-xl transition-all"
      >
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Add Transaction
        </DialogTitle>
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-gray-700 dark:text-gray-400 text-sm mb-2">
                Select Account
              </p>
              <select
                onChange={(e) => getAcccountBalance(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:text-gray-200"
              >
                <option disabled value="">
                  Select Account
                </option>

                {accountData?.map((acc, index) => (
                  <option
                    key={index}
                    value={acc?.account_name}
                    className="w-full flex items-center justify-center dark:bg-slate-900"
                  >
                    {acc?.account_name} {" - "}
                    {formatCurrency(
                      acc?.account_balance,
                      acc?.currency || "USD"
                    )}
                  </option>
                ))}
              </select>
              {accountData?.map((acc, index) => (
                <option
                  key={index}
                  value={acc?.account_name}
                  className="w-full flex items-center justify-center dark:bg-slate-900"
                >
                  {acc?.account_name} {" - "}
                  {formatCurrency(acc?.account_balance, acc?.currency || "USD")}
                </option>
              ))}{" "}
            </div>

            {accountBalance <= 0 && (
              <div className="flex items-center gap-2 bg-yellow-400 text-black p-2 mt-6">
                <MdOutlineWarning size={30} />
                <span>Transaction not possible due to insufficent balance</span>
              </div>
            )}

            {accountBalance > 0 && (
              <>
                <Input
                  name="description"
                  label="Description"
                  placeholder="Grocery Store"
                  {...register("description", {
                    required: "Transaction description is required",
                  })}
                  error={errors.description ? errors.description.message : ""}
                  className="inputStyle dark:text-gray-200"
                />

                <Input
                  name="amount"
                  label="Amount"
                  type="number"
                  placeholder="Enter account number"
                  {...register("amount", {
                    required: "TransactionAmount is required",
                  })}
                  error={errors.amount ? errors.amount.message : ""}
                  className="inputStyle dark:text-gray-200"
                />
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-violet-700 text-white"
            >
              {`Confirm ${
                watch("amount") ? formatCurrency(watch("amount")) : ""
              }`}
            </Button>
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddTransaction;
