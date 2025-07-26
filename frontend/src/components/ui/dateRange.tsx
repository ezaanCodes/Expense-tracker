import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { formatCurrency, getDateSevenDaysAgo } from "../../libs/index";

const DateRange = () => {
  const sevenDaysAgo = getDateSevenDaysAgo();

  const [searchParams, setSearchParams] = useSearchParams();

  const [dateFrom, setDateFrom] = useState(() => {
    const df = searchParams.get("df");
    return df && new Date(df).getTime() <= new Date().getTime()
      ? df
      : sevenDaysAgo || new Date().toISOString().split("T")[0];
  });

  const [dateTo, setDateTo] = useState(() => {
    const dt = searchParams.get("dt");
    return dt && new Date(dt).getTime() <= new Date().getTime()
      ? dt
      : sevenDaysAgo || new Date().toISOString().split("T")[0];
  });

  useEffect(() => {
    setSearchParams({ df: dateFrom, dt: dateTo });
  }, [dateFrom, dateTo]);

  const handleDateFromChange = (e) => {
    const df = e.target.value;
    setDateFrom(df);
    if (new Date(df).getTime() > new Date(dateTo).getTime()) {
      setDateTo(df);
    }
  };

  const handleDateToChange = (e) => {
    const dt = e.target.value;
    setDateTo(dt);
    if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
      setDateFrom(dt);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <label
          htmlFor="dateFrom"
          className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
        >
          Filter
        </label>

        <input
          className="imputStyles"
          name="dateFrom"
          type="date"
          max={dateTo}
          value={dateFrom}
          onChange={handleDateFromChange}
        />
      </div>

      <div className="flex items-center gap-1">
        <label
          htmlFor="dateFrom"
          className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
        >
          To
        </label>

        <input
          className="imputStyles"
          name="dateFrom"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={dateFrom}
          onChange={handleDateFromChange}
        />
      </div>

      
    </div>
  );
};

export default DateRange;
