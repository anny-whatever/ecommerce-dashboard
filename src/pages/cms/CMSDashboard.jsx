// src/pages/cms/CMSDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { format } from "date-fns";
import { usePagination } from "../../hooks/usePagination";
import {
  PlusIcon,
  DocumentTextIcon,
  PhotoIcon,
  RectangleGroupIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const CMSDashboard = () => {
  const { content } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContent, setFilteredContent] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter content based on search term and active tab
  useEffect(() => {
    let filtered = content;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.content.toLowerCase().includes(term)
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => item.type === activeTab);
    }

    setFilteredContent(filtered);
  }, [content, searchTerm, activeTab]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredContent, 10);

  // Count content by type
  const contentCounts = content.reduce((counts, item) => {
    counts[item.type] = (counts[item.type] || 0) + 1;
    return counts;
  }, {});

  // Content type tabs
  const tabs = [
    { id: "all", name: "All Content", count: content.length },
    {
      id: "product_page",
      name: "Product Pages",
      count: contentCounts.product_page || 0,
    },
    {
      id: "category_page",
      name: "Category Pages",
      count: contentCounts.category_page || 0,
    },
    {
      id: "blog_post",
      name: "Blog Posts",
      count: contentCounts.blog_post || 0,
    },
    { id: "banner", name: "Banners", count: contentCounts.banner || 0 },
    {
      id: "promotion",
      name: "Promotions",
      count: contentCounts.promotion || 0,
    },
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case "product_page":
        return <TagIcon className="h-5 w-5" />;
      case "category_page":
        return <RectangleGroupIcon className="h-5 w-5" />;
      case "blog_post":
        return <DocumentTextIcon className="h-5 w-5" />;
      case "banner":
        return <PhotoIcon className="h-5 w-5" />;
      case "promotion":
        return <TagIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Content Management
        </h1>
        <Link to="/cms/content/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Content
        </Link>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Content
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {content.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Published
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        content.filter((item) => item.status === "published")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Drafts
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {content.filter((item) => item.status === "draft").length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Content Library
              </h2>
            </div>
            <div className="flex mt-4 sm:mt-0">
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
                  placeholder="Search content..."
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="sm:hidden">
              <select
                id="tabs"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.name} ({tab.count})
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      aria-current={activeTab === tab.id ? "page" : undefined}
                    >
                      {tab.name}
                      <span
                        className={`${
                          activeTab === tab.id
                            ? "bg-primary-100 text-primary-600"
                            : "bg-gray-100 text-gray-900"
                        } hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Title
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
                  Author
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Last Updated
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
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                    <Link
                      to={`/cms/content/${item.id}`}
                      className="hover:underline"
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">
                        {getTypeIcon(item.type)}
                      </span>
                      <span>
                        {item.type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.author}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(item.updatedAt), "MMM d, yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link
                      to={`/cms/content/${item.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/cms/content/${item.id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No content found
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
                  {Math.min(currentPage * 10, filteredContent.length)}
                </span>{" "}
                of <span className="font-medium">{filteredContent.length}</span>{" "}
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

      {/* Media Library Preview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              Media Library
            </h2>
            <Link
              to="/cms/media"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {content
              .filter((item) => item.media && item.media.length > 0)
              .slice(0, 6)
              .map((item, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={item.media[0]}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <Link
                        to={`/cms/content/${item.id}`}
                        className="bg-white p-2 rounded-full"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-800" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            {content.filter((item) => item.media && item.media.length > 0)
              .length === 0 && (
              <div className="col-span-full text-center py-10">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No media found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading a new image with your content.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
