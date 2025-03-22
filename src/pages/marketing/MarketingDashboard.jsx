// src/pages/marketing/MarketingDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { format } from "date-fns";
import { usePagination } from "../../hooks/usePagination";
import {
  PlusIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import CampaignPerformanceChart from "../../components/marketing/CampaignPerformanceChart";
import ChannelPerformanceChart from "../../components/marketing/ChannelPerformanceChart";

const MarketingDashboard = () => {
  const { campaigns } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Filter campaigns based on search term and active tab
  useEffect(() => {
    let filtered = campaigns;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(term) ||
          campaign.description.toLowerCase().includes(term)
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((campaign) => campaign.status === activeTab);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, activeTab]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredCampaigns, 10);

  // Count campaigns by status
  const campaignStatusCounts = campaigns.reduce((counts, campaign) => {
    counts[campaign.status] = (counts[campaign.status] || 0) + 1;
    return counts;
  }, {});

  // Campaign status tabs
  const tabs = [
    { id: "all", name: "All Campaigns", count: campaigns.length },
    { id: "active", name: "Active", count: campaignStatusCounts.active || 0 },
    {
      id: "scheduled",
      name: "Scheduled",
      count: campaignStatusCounts.scheduled || 0,
    },
    {
      id: "completed",
      name: "Completed",
      count: campaignStatusCounts.completed || 0,
    },
    { id: "draft", name: "Draft", count: campaignStatusCounts.draft || 0 },
    { id: "paused", name: "Paused", count: campaignStatusCounts.paused || 0 },
  ];

  // Calculate marketing metrics
  const calculateMetrics = () => {
    const totalBudget = campaigns.reduce(
      (sum, campaign) => sum + campaign.budget,
      0
    );
    const totalSpent = campaigns.reduce(
      (sum, campaign) => sum + campaign.spent,
      0
    );

    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.status === "active"
    );
    const activeBudget = activeCampaigns.reduce(
      (sum, campaign) => sum + campaign.budget,
      0
    );
    const activeSpent = activeCampaigns.reduce(
      (sum, campaign) => sum + campaign.spent,
      0
    );

    const totalImpressions = campaigns.reduce(
      (sum, campaign) => sum + campaign.performance.impressions,
      0
    );
    const totalClicks = campaigns.reduce(
      (sum, campaign) => sum + campaign.performance.clicks,
      0
    );
    const totalConversions = campaigns.reduce(
      (sum, campaign) => sum + campaign.performance.conversions,
      0
    );

    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      activeBudget,
      activeSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      ctr,
      conversionRate,
    };
  };

  const metrics = calculateMetrics();

  // Group campaigns by type
  const campaignsByType = campaigns.reduce((grouped, campaign) => {
    if (!grouped[campaign.type]) {
      grouped[campaign.type] = [];
    }

    grouped[campaign.type].push(campaign);
    return grouped;
  }, {});

  // Get campaign type icon
  const getCampaignTypeIcon = (type) => {
    switch (type) {
      case "email":
        return <EnvelopeIcon className="h-5 w-5" />;
      case "social_media":
        return <UserGroupIcon className="h-5 w-5" />;
      case "search":
        return <MagnifyingGlassIcon className="h-5 w-5" />;
      case "display":
        return <GlobeAltIcon className="h-5 w-5" />;
      case "referral":
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <MegaphoneIcon className="h-5 w-5" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "paused":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marketing Campaigns
        </h1>
        <Link to="/marketing/campaigns/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Campaign
        </Link>
      </div>

      {/* Marketing Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Budget
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${metrics.totalBudget.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Spent: </span>
              <span className="font-medium text-gray-900">
                ${metrics.totalSpent.toLocaleString()} (
                {((metrics.totalSpent / metrics.totalBudget) * 100).toFixed(1)}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Impressions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metrics.totalImpressions.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">CTR: </span>
              <span className="font-medium text-gray-900">
                {metrics.ctr.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Clicks
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metrics.totalClicks.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Cost per Click: </span>
              <span className="font-medium text-gray-900">
                $
                {metrics.totalClicks > 0
                  ? (metrics.totalSpent / metrics.totalClicks).toFixed(2)
                  : "0.00"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Conversions
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metrics.totalConversions.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Conversion Rate: </span>
              <span className="font-medium text-gray-900">
                {metrics.conversionRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Campaign Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <CampaignPerformanceChart campaigns={campaigns} />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Channel Performance
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ChannelPerformanceChart campaignsByType={campaignsByType} />
            </div>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                All Campaigns
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
                  placeholder="Search campaigns..."
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
                  Campaign
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
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Spent
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Performance
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
              {paginatedData.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                    <Link
                      to={`/marketing/campaigns/${campaign.id}`}
                      className="hover:underline"
                    >
                      {campaign.name}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {campaign.startDate && (
                        <>
                          {format(new Date(campaign.startDate), "MMM d, yyyy")}
                          {campaign.endDate && (
                            <>
                              {" "}
                              -{" "}
                              {format(
                                new Date(campaign.endDate),
                                "MMM d, yyyy"
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">
                        {getCampaignTypeIcon(campaign.type)}
                      </span>
                      <span>
                        {campaign.type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                        campaign.status
                      )}`}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${campaign.budget.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${campaign.spent.toLocaleString()}
                    <span className="text-xs text-gray-400 ml-1">
                      ({((campaign.spent / campaign.budget) * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>
                        CTR:{" "}
                        {(
                          (campaign.performance.clicks /
                            campaign.performance.impressions) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                      <span>
                        Conv:{" "}
                        {(
                          (campaign.performance.conversions /
                            campaign.performance.clicks) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link
                      to={`/marketing/campaigns/${campaign.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/marketing/campaigns/${campaign.id}/edit`}
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
                    colSpan="7"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No campaigns found
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
                  {Math.min(currentPage * 10, filteredCampaigns.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredCampaigns.length}</span>{" "}
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

export default MarketingDashboard;
