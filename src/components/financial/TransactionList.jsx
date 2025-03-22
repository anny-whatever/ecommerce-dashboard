// src/components/financial/TransactionList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { usePagination } from "../../hooks/usePagination";

const TransactionList = ({
  transactions,
  showPagination = true,
  itemsPerPage = 10,
}) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(transactions, itemsPerPage);

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800";
      case "refund":
        return "bg-red-100 text-red-800";
      case "subscription":
        return "bg-blue-100 text-blue-800";
      case "shipping":
        return "bg-purple-100 text-purple-800";
      case "tax":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginatedData.map((transaction) => (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                {transaction.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getTypeColor(
                    transaction.type
                  )}`}
                >
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
                </span>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                {transaction.description}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                <span
                  className={
                    transaction.type === "refund"
                      ? "text-red-500"
                      : transaction.type === "sale"
                      ? "text-green-500"
                      : "text-gray-500"
                  }
                >
                  {transaction.type === "refund" ? "-" : ""}$
                  {Math.abs(transaction.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status.charAt(0).toUpperCase() +
                    transaction.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="py-4 text-center text-sm text-gray-500"
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, transactions.length)}
              </span>{" "}
              of <span className="font-medium">{transactions.length}</span>{" "}
              results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="hidden md:flex mx-2 items-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      page === currentPage
                        ? "bg-primary-50 text-primary-600 border border-primary-500"
                        : "text-gray-700 hover:bg-gray-50"
                    } mx-1 rounded-md`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default TransactionList;
