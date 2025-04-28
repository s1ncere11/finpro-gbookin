// components/DateRangeSelector.tsx
"use client";

import { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="relative">
      {/* Trigger UI kamu */}
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className="cursor-pointer border p-2 rounded-md w-60 bg-white shadow"
      >
        <p className="text-xs text-gray-500">Check In - Check Out</p>
        <p className="text-sm font-medium">
          {format(range[0].startDate, "dd MMM")} -{" "}
          {format(range[0].endDate, "dd MMM")}
        </p>
      </div>

      {/* Kalender muncul saat diklik */}
      {showCalendar && (
        <div className="absolute z-50 mt-2">
          <DateRange
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#7c3aed"]}
          />
        </div>
      )}
    </div>
  );
}
