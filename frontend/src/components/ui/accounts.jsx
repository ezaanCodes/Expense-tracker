import React from "react";
import { FaBtc, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import Title from "./title";
import { Link } from "react-router-dom";
import { formatCurrency, maskAccountNumber } from "../../libs";

// const data = [
//   {
//     name: "Crypto",
//     account: "MAIL@gmail.com",
//     amount: "85,345.00",
//     icon: (
//       <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'>
//         <FaBtc size={26} />
//       </div>
//     ),
//   },
//   {
//     name: "Visa Debit Card",
//     account: "2463********8473",
//     amount: "15,345.00",
//     icon: (
//       <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'>
//         <RiVisaLine size={26} />
//       </div>
//     ),
//   },
//   {
//     name: "MasterCard",
//     account: "6785********8473",
//     amount: "55,345.00",
//     icon: (
//       <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'>
//         <FaCcMastercard size={26} />
//       </div>
//     ),
//   },
//   {
//     name: "Paypal",
//     account: "MAIL@gmail.com",
//     amount: "35,345.00",
//     icon: (
//       <div className='w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full'>
//         <FaPaypal size={26} />
//       </div>
//     ),
//   },
// ];
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
}

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

const Accounts = ({ data }) => {
  return (
    <div className='mt-20 md:mt-0 py-5 md:py-20 md:w-1/3'>
      <Title title='Accounts' />
      <Link to="/accounts"
        className='text-sm text-gray-600 dark:text-gray-500'
      >
        View all your accounts
      </Link>

      <div className='w-full'>
        {Array.isArray(data) && data.map((item, index) => (
          <div
            key={index + item?.account_name}
            className='flex items-center justify-between mt-6'
          >
            <div className='flex items-center gap-4'>
              <div>
                {getIcon(item?.account_name)}
                {/*                 
                {ICONS[item?.account_name?.toLowerCase().trim()] ?? (
                  <div className="w-12 h-12 bg-gray-400 text-white flex items-center justify-center rounded-full">
                    ?
                  </div>
                )} */}
              </div>

              <div>
                <p className='text-black dark:text-gray-400 text-lg'>
                  {item?.account_name}
                </p>
                <span className='text-gray-600'>
                  {maskAccountNumber(item.account_number)}
                </span>
              </div>

            </div>

            <div>
              <p className='text-xl text-black dark:text-gray-400 font-medium'>
                {formatCurrency(item?.account_balance)}
              </p>
              <span className='text-sm text-gray-600 dark:text-violet-700'>
                Account Balance
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;