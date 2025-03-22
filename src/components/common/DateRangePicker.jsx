// src/components/common/DateRangePicker.jsx
import { useState, useRef, useEffect } from "react";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useClickOutside } from "../../hooks/useClickOutside";

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("custom");
  const dropdownRef = useRef(null);

  // Use the hook to close the dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Format dates for display
  const formattedStartDate = format(startDate, "MMM d, yyyy");
  const formattedEndDate = format(endDate, "MMM d, yyyy");

  // Update the selected preset when startDate or endDate change
  useEffect(() => {
    // Try to match the current date range with a preset
    const today = new Date();
    const last7Days = subDays(today, 6);
    const last30Days = subDays(today, 29);
    const last90Days = subDays(today, 89);
    const thisMonth = {
      start: startOfMonth(today),
      end: endOfMonth(today),
    };
    const lastMonth = {
      start: startOfMonth(subMonths(today, 1)),
      end: endOfMonth(subMonths(today, 1)),
    };

    if (
      format(startDate, "yyyy-MM-dd") === format(last7Days, "yyyy-MM-dd") &&
      format(endDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    ) {
      setSelectedPreset("last7Days");
    } else if (
      format(startDate, "yyyy-MM-dd") === format(last30Days, "yyyy-MM-dd") &&
      format(endDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    ) {
      setSelectedPreset("last30Days");
    } else if (
      format(startDate, "yyyy-MM-dd") === format(last90Days, "yyyy-MM-dd") &&
      format(endDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    ) {
      setSelectedPreset("last90Days");
    } else if (
      format(startDate, "yyyy-MM-dd") ===
        format(thisMonth.start, "yyyy-MM-dd") &&
      format(endDate, "yyyy-MM-dd") === format(thisMonth.end, "yyyy-MM-dd")
    ) {
      setSelectedPreset("thisMonth");
    } else if (
      format(startDate, "yyyy-MM-dd") ===
        format(lastMonth.start, "yyyy-MM-dd") &&
      format(endDate, "yyyy-MM-dd") === format(lastMonth.end, "yyyy-MM-dd")
    ) {
      setSelectedPreset("lastMonth");
    } else {
      setSelectedPreset("custom");
    }
  }, [startDate, endDate]);

  const handlePresetChange = (preset) => {
    const today = new Date();

    switch (preset) {
      case "last7Days":
        onChange({
          startDate: subDays(today, 6),
          endDate: today,
        });
        break;
      case "last30Days":
        onChange({
          startDate: subDays(today, 29),
          endDate: today,
        });
        break;
      case "last90Days":
        onChange({
          startDate: subDays(today, 89),
          endDate: today,
        });
        break;
      case "thisMonth":
        onChange({
          startDate: startOfMonth(today),
          endDate: endOfMonth(today),
        });
        break;
      case "lastMonth":
        onChange({
          startDate: startOfMonth(subMonths(today, 1)),
          endDate: endOfMonth(subMonths(today, 1)),
        });
        break;
      case "lastSixMonths":
        onChange({
          startDate: startOfMonth(subMonths(today, 5)),
          endDate: endOfMonth(today),
        });
        break;
      default:
        break;
    }

    setSelectedPreset(preset);
    setIsOpen(false);
  };

  const handleDateChange = (e, type) => {
    const date = new Date(e.target.value);

    if (type === "start") {
      onChange({
        startDate: date,
        endDate,
      });
    } else {
      onChange({
        startDate,
        endDate: date,
      });
    }

    setSelectedPreset("custom");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
        <span>
          {formattedStartDate} - {formattedEndDate}
        </span>
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Presets
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "last7Days"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("last7Days")}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "last30Days"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("last30Days")}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "last90Days"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("last90Days")}
                >
                  Last 90 Days
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "thisMonth"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("thisMonth")}
                >
                  This Month
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "lastMonth"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("lastMonth")}
                >
                  Last Month
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium ${
                    selectedPreset === "lastSixMonths"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handlePresetChange("lastSixMonths")}
                >
                  Last 6 Months
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Custom Range
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-xs text-gray-500"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    value={format(startDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange(e, "start")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-xs text-gray-500"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    value={format(endDate, "yyyy-MM-dd")}
                    onChange={(e) => handleDateChange(e, "end")}
                    min={format(startDate, "yyyy-MM-dd")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
