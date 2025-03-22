// src/pages/product/ProductList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const ProductList = () => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  // Get unique categories for filter
  const categories = [...new Set(products.map((product) => product.category))];

  // Apply filters and search
  useEffect(() => {
    let result = [...products];

    // Apply search
    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerSearchTerm) ||
          product.sku.toLowerCase().includes(lowerSearchTerm) ||
          product.category.toLowerCase().includes(lowerSearchTerm) ||
          product.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [products, debouncedSearchTerm, sortConfig, filters]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredProducts, 10);

  // Handle sort
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
  };

  const getStockStatus = (stockLevel) => {
    if (stockLevel <= 0) {
      return {
        text: "Out of Stock",
        className: "bg-red-100 text-red-800",
      };
    } else if (stockLevel <= 5) {
      return {
        text: "Low Stock",
        className: "bg-yellow-100 text-yellow-800",
      };
    } else if (stockLevel <= 20) {
      return {
        text: "Medium Stock",
        className: "bg-blue-100 text-blue-800",
      };
    } else {
      return {
        text: "In Stock",
        className: "bg-green-100 text-green-800",
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link to="/products/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-full md:w-auto mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search products..."
                />
              </div>

              <button
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                {Object.values(filters).some(
                  (val) => val !== "" && val !== false
                ) && (
                  <span className="ml-1 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <span>
                Showing {paginatedData.length} of {filteredProducts.length}{" "}
                products
              </span>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleResetFilters}
                >
                  Reset filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="minPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="minPrice"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="maxPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="maxPrice"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <div className="flex h-5 items-center">
                    <input
                      id="inStock"
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) =>
                        setFilters({ ...filters, inStock: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="inStock"
                      className="font-medium text-gray-700"
                    >
                      In Stock Only
                    </label>
                  </div>
                </div>
              </div>

              {Object.values(filters).some(
                (val) => val !== "" && val !== false
              ) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Category: {filters.category}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, category: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.minPrice && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Min Price: ${filters.minPrice}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, minPrice: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.maxPrice && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Max Price: ${filters.maxPrice}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, maxPrice: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.inStock && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      In Stock Only
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, inStock: false })
                        }
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Product
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("sku")}
                >
                  <div className="flex items-center">
                    SKU
                    {sortConfig.key === "sku" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === "category" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Price
                    {sortConfig.key === "price" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center">
                    Stock
                    {sortConfig.key === "stock" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((product) => {
                const stockStatus = getStockStatus(product.stock);

                return (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                      <Link
                        to={`/products/${product.id}`}
                        className="hover:underline"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      $
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${stockStatus.className}`}
                      >
                        {stockStatus.text} ({product.stock})
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, filteredProducts.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredProducts.length}</span>{" "}
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
    </div>
  );
};

export default ProductList;
