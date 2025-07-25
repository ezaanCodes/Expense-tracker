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

const TransferMoney = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState([]);
  const [fromAccountInfo, setFromAccountInfo] = useState({});
  const [toAccountInfo, setToAccountInfo] = useState({});

  const submit = async (data) => {
    try {
      setLoading(true);

      const newData = {
        ...data,
        from_account: fromAccountInfo.id,
        to_account: toAccountInfo.id,
      };
      console.log("Submitting transfer data:", newData);

      const { data: res } = await api.put(
        `/transaction/transfer-money`,
        newData
      );

      if (res?.status === "success") {
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Error Transfering money:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const getAccountBalance = (setAccount, val) => {
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val
    );

    setAccount(filteredAccount);
  };

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const { data: res } = await api.get("/account");
      setAccountData(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
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
          Transfer Money
        </DialogTitle>
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-sm mb-2 text-gray-700 dark:text-gray-400">
                Select Account
              </p>

              <select
                name=""
                onChange={(e) => {
                  getAccountBalance(setFromAccountInfo, e.target.value);
                }}
                className="w-full border rounded-md px-3 py-2 dark:text-gray-200 dark:bg-slate-700 dark:border-gray-600"
              >
                <option
                  disabled
                  selected
                  className="w-full flex items-center justify-center dark:bg-slate-900"
                >
                  Select Account
                </option>
                {accountData?.map((account, index) => (
                  <option
                    key={index}
                    value={account.account_name}
                    className="w-full flex items-center dark:bg-slate-900"
                  >
                    {account.account_name} {" - "}
                    {formatCurrency(account?.account_balance)}
                  </option>
                ))}
              </select>
              <div className="flex flex-col gap-1 mb-2">
                <p className="text-sm mb-2 text-gray-700 dark:text-gray-400">
                  From Account
                </p>
                <select
                  name=""
                  onChange={(e) => {
                    getAccountBalance(setToAccountInfo, e.target.value);
                  }}
                  className="w-full border rounded-md px-3 py-2 dark:text-gray-200 dark:bg-slate-700 dark:border-gray-600"
                >
                  <option
                    disabled
                    selected
                    className="w-full flex items-center justify-center dark:bg-slate-900"
                  >
                    To Account
                  </option>
                  {accountData
                    ?.filter(
                      (account) =>
                        account.account_name !== fromAccountInfo?.account_name
                    )
                    .map((account, index) => (
                      <option
                        key={index}
                        value={account.account_name}
                        className="w-full flex items-center dark:bg-slate-900"
                      >
                        {account.account_name} {" - "}
                        {formatCurrency(account.account_balance)}
                      </option>
                    ))}{" "}
                </select>
              </div>

              {fromAccountInfo?.account_balance <= 0 && (
                <div className="flex items-center gap-3 bg-yellow-400 text-black p-2 mt-6 rounded">
                  <MdOutlineWarning size={28} />
                  <p className="text-sm">
                    Insufficient balance in {fromAccountInfo?.account_name}
                  </p>
                </div>
              )}

              {fromAccountInfo?.account_balance > 0 && toAccountInfo.id && (
                <div className="flex flex-col gap-1 mb-2">
                  <Input
                    label="Amount"
                    type="number"
                    name="amount"
                    placeholder="Enter amount to transfer"
                    className="inputStyle dark:text-gray-200 dark:border-gray-600"
                    {...register("amount", { required: true })}
                    error={errors.amount ? errors.amount.message : ""}
                  />
                  <div className="w-full mt-8">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-violet-700 text-white"
                    >
                      {}
                      {loading ? (
                        <BiLoader className="animate-spin" />
                      ) : (
                        `Transfer ${
                          watch("amount") ? formatCurrency(watch("amount")) : ""
                        }`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div />
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default TransferMoney;
