import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateSevenDaysAgo } from "../../libs/index";

const DateRange = () => {
  const sevenDaysAgo = getDateSevenDaysAgo(); // should return 'YYYY-MM-DD'

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
      : new Date().toISOString().split("T")[0];
  });

  useEffect(() => {
    setSearchParams({ df: dateFrom, dt: dateTo });
  }, [dateFrom, dateTo]);

  const handleDateFromChange = (e) => {
    const df = e.target.value;
    setDateFrom(df);
    if (new Date(df).getTime() > new Date(dateTo).getTime()) {
      setDateTo(df); // auto-fix dateTo if it's before new dateFrom
    }
  };

  const handleDateToChange = (e) => {
    const dt = e.target.value;
    setDateTo(dt);
    if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
      setDateFrom(dt); // auto-fix dateFrom if it's after new dateTo
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Date From Input */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="dateFrom"
          className="block text-gray-700 dark:text-gray-400 text-sm"
        >
          From
        </label>
        <input
          id="dateFrom"
          className="imputStyles dark:text-gray-500"
          name="dateFrom"
          type="date"
          max={dateTo}
          value={dateFrom}
          onChange={handleDateFromChange}
        />
      </div>

      {/* Date To Input */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="dateTo"
          className="block text-gray-700 dark:text-gray-400 text-sm"
        >
          To
        </label>
        <input
          id="dateTo"
          className="imputStyles dark:text-gray-500"
          name="dateTo"
          type="date"
          min={dateFrom}
          max={new Date().toISOString().split("T")[0]}
          value={dateTo}
          onChange={handleDateToChange}
        />
      </div>
    </div>
  );
};

export default DateRange;
