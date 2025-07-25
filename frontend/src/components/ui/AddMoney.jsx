/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { formatCurrency } from "../../libs";
import DialogWrapper from "../ui/wrappers/dialog-wrapper";
import { DialogPanel, DialogTitle } from "@headlessui/react";
import Input from "../ui/input";
import { Button } from "./button";
import api from "../../libs/apiCall";
import { toast } from "sonner";


const AddMoney = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    try {
      setLoading(true);

      const { data: res } = await api.put(`/account/add-money/${id}`, data);

      if (res?.data) {
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
          Add Money To Account
        </DialogTitle>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <>
              <Input
                name="amount"
                label="Amount"
                type="number"
                placeholder="Enter account number"
                {...register("amount", {
                  required: "Amount is required",
                })}
                error={
                  errors.amount ? errors.amount.message : ""
                }
                className="inputStyle dark:text-gray-200"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-violet-700 text-white"
              >
                {`Submit ${watch("amount") ? formatCurrency(watch("amount")) : ""}`}
              </Button>
            </>
       
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddMoney;
