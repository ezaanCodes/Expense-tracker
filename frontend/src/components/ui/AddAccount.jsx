/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import useStore from "../../store";
import { generateAccountNumber } from "../../libs";
import DialogWrapper from "../ui/wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import Input from "../ui/input";
import { Button } from "./button";
import { BiLoader } from "react-icons/bi";
import api from "../../libs/apiCall";
import { toast } from "sonner";

const accounts = [
  "Cash Account",
  "Crypto",
  "Visa Debit Card",
  "Paypal Account",
];

const AddAccount = ({ isOpen, setIsOpen, refetch }) => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { account_number: generateAccountNumber() },
  });

  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);

      const newData = { ...data, name: selectedAccount };

      const { data: res } = await api.post("/account/create", newData);

      if (res?.data) {
        toast.success(res?.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Error adding account:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };
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
          Add Account
        </DialogTitle>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-sm text-gray-700 dark:text-gray-400 text-sm mb-2">
              Select Account Type
            </p>
            <select
              {...register("account_type", { required: true })}
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:text-gray-200"
            >
              {accounts.map((account, index) => (
                <option
                  key={index}
                  value={account}
                  className="w-full flex items-center justify-center dark:bg-slate-900 "
                >
                  {account}
                </option>
              ))}
            </select>
          </div>
          {user?.accounts?.includes(selectedAccount) && (
            <p className="text-red-500 text-sm mt-2">
              This account already exists in your list.
            </p>
          )}
          {!user?.accounts?.includes(selectedAccount) && (
            <>
              <Input
                name="account_number"
                label="Account Number"
                placeholder="Enter account number"
                {...register("account_number", {
                  required: "Account number is required",
                })}
                error={
                  errors.account_number ? errors.account_number.message : ""
                }
                className="inputStyle dark:text-gray-200"
              />

              <Input
                name="number"
                type="number"
                label="Initial Amount"
                placeholder="Enter amount"
                {...register("amount", {
                  required: "Initial amount is required",
                })}
                error={errors.amount ? errors.amount.message : ""}
                className="inputStyle dark:text-gray-200"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-violet-700 text-white"
              >
                {loading ? (
                  <BiLoader className="animate-spin" />
                ) : (
                  "Add Account"
                )}
              </Button>
            </>
          )}
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddAccount;
