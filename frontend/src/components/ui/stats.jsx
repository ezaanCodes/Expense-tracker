import React from "react";
import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { SiCashapp } from "react-icons/si";
import { formatCurrency } from "../../libs";
import { Card } from "./card";

// const data = [
//     {
//         label: "Your Total Balance",
//         amount: "100,020.00",
//         increase: 10.9,
//         icon: <BsCurrencyDollar size={26} />,
//     },
//     {
//         label: "Total Income",
//         amount: "150,010.00",
//         icon: <BsCashCoin size={26} />,
//         increase: 8.9,
//     },
//     {
//         label: "Total Expense",
//         amount: "50,010.00",
//         icon: <SiCashapp size={26} />,
//         increase: -10.9,
//     },
// ];

const ICON_STYLES = [
    "bg-blue-300 text-blue-800",
    "bg-emerald-300 text-emerald-800",
    "bg-rose-300 text-rose-800",
];

const Stats = ({ dt }) => {
    const data = [
        {
            label: "Total Balance",
            amount: dt?.balance,
            increase: 10.9,
            icon: <BsCurrencyDollar size={26} />
        },
        {
            label: "Total Income",
            amount: dt?.income,
            increase: 8.9,
            icon: <BsCashCoin size={26} />
        },
        {
            label: "Total Expense",
            amount: dt?.expense,
            increase: -10.9,
            icon: <SiCashapp size={26} />
        },
    ]

    const ItemCard = ({ item, index }) => {
        return (
            <Card
                className=" flex items-center justify-between 
                w-full h-48 gap-5 px-4 py-12 drop-shadow-2xl 2xl:px-8 
                bg-gray-50 dark:bg-slate-800 border-0
                dark:border dark:border-slate-900 rounded-xl " >
                <div className="flex items-center w-full h-full gap-4">
                    <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full ${ICON_STYLES[index]}`}
                    >
                        {item.icon}
                    </div>

                    <div className='space-y-3'>
                        <span className='text-gray-600 dark:text-gray-400 text-base md:text-lg'>
                            {item.label}
                        </span>
                        <p className='text-2xl 2xl:text-3xl font-medium text-black dark:text-gray-400'>
                            {formatCurrency(item?.amount || 0.0)}
                        </p>
                        <span className='text-xs dark:text-gray-600 text-base md:text-sm dark:text-gray-500'>
                            Overall {item.label}
                        </span>
                    </div>

                </div>

            </Card>
        )
    }

    return (
        <div className='flex flex-col 
        md:flex-row items-center justify-between gap-8 2xl:gap-30 mb-20'>
            {data.map((item, index) => (
                <ItemCard key={index} item={item} index={index} />

            ))}
        </div>
    );
};

export default Stats;