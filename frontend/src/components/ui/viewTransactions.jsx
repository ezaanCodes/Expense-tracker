// import { DialogWrapper, DialogPanel, DialogTitle } from "@headlessui/react";
import { PiSealCheckFill } from "react-icons/pi";
import { formatCurrency } from "../../libs/index"; // adjust path as needed
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import DialogWrapper from "./wrappers/dialog-wrapper";

const ViewTransaction = ({ data, isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(false);

  const longDateString = new Date(data?.createdat).toLocaleDateString();
  const longTimeString = new Date(data?.createdat).toLocaleTimeString();

  return (
    <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
      <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
        >
          Transaction Detail
        </DialogTitle>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500 border-y border-gray-300 dark:border-gray-700 py-2">
            <p>{data?.source}</p>
            <PiSealCheckFill size={30} className="text-emerald-500 ml-4" />
          </div>

          <div className="mb-10">
            <p className="text-xl text-black dark:text-white">
              {data?.description}
            </p>
            <span className="text-xs text-gray-600">
              {longDateString} {longTimeString}
            </span>
          </div>

          <div className="mt-10 mb-3 flex justify-between">
            <p className="text-black dark:text-gray-400 text-2xl font-bold">
              <span
                className={`${
                  data?.type === "income" ? "text-emerald-600" : "text-red-600"
                } font-bold ml-1`}
              >
                {data?.type === "income" ? "+" : "-"}
              </span>{" "}
              {formatCurrency(data?.amount)}
            </p>
          </div>

          <button
            type="button"
            className="rounded-md outline-none bg-violet-800 px-4 py-2 text-sm font-medium text-white"
            onClick={closeModal}
          >
            Got it, thanks!
          </button>
        </div>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default ViewTransaction;
