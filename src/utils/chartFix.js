// src/utils/chartFix.js (expanded)
import {
  format,
  subMonths,
  eachMonthOfInterval,
  subDays,
  addDays,
} from "date-fns";

// SECTION 1: TRANSACTION & FINANCIAL DATA
/**
 * Generates consistent sample transaction data for charts
 */
export const generateSampleTransactions = (count = 300) => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  const transactions = [];

  // Create consistent month divisions for better charting
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now,
  });

  // Generate transactions per month to ensure coverage
  months.forEach((monthDate) => {
    const monthName = format(monthDate, "MMM yyyy");
    const monthSales = Math.floor(Math.random() * 20) + 30; // 30-50 sales per month

    // Sales (positive transactions)
    for (let i = 0; i < monthSales; i++) {
      transactions.push({
        id: `sale-${monthName}-${i}`,
        type: "sale",
        amount: Math.floor(Math.random() * 900) + 100, // $100-$1000
        date: new Date(monthDate).toISOString(),
        description: `Sale transaction ${i}`,
        status: "completed",
      });
    }

    // Add a few refunds
    for (let i = 0; i < Math.floor(monthSales / 10); i++) {
      transactions.push({
        id: `refund-${monthName}-${i}`,
        type: "refund",
        amount: -(Math.floor(Math.random() * 300) + 50), // $50-$350 refund (negative)
        date: new Date(monthDate).toISOString(),
        description: `Refund transaction ${i}`,
        status: "completed",
      });
    }

    // Add expense categories for expense breakdown chart
    const expenseTypes = [
      "shipping",
      "tax",
      "subscription",
      "marketing",
      "operations",
      "salary",
      "supplies",
    ];

    expenseTypes.forEach((expType) => {
      // Add 3-8 expenses of each type per month
      const expCount = Math.floor(Math.random() * 6) + 3;
      for (let i = 0; i < expCount; i++) {
        transactions.push({
          id: `${expType}-${monthName}-${i}`,
          type: expType,
          amount: Math.floor(Math.random() * 200) + 50, // $50-$250
          date: new Date(monthDate).toISOString(),
          description: `${expType} expense ${i}`,
          status: "completed",
        });
      }
    });
  });

  return transactions;
};

// SECTION 2: PRODUCT & SALES DATA
/**
 * Generate meaningful product sales data for pie charts
 */
export const generateProductSalesData = () => {
  return [
    { name: "Laptop", sales: 42000, category: "Electronics" },
    { name: "Smartphone", sales: 28000, category: "Electronics" },
    { name: "Headphones", sales: 16500, category: "Electronics" },
    { name: "T-Shirt", sales: 14000, category: "Clothing" },
    { name: "Jeans", sales: 12500, category: "Clothing" },
    { name: "Coffee Maker", sales: 8900, category: "Home & Kitchen" },
    { name: "Blender", sales: 7800, category: "Home & Kitchen" },
    { name: "Face Cream", sales: 6500, category: "Beauty" },
    { name: "Dumbbells", sales: 5200, category: "Sports" },
    { name: "Yoga Mat", sales: 4800, category: "Sports" },
  ];
};

// SECTION 3: MARKETING CAMPAIGN DATA
/**
 * Generates marketing campaign data for marketing dashboard
 */
export const generateMarketingData = () => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);

  // Campaign types and their typical metrics
  const campaignTypes = [
    { type: "email", convRate: 3.5, ctr: 2.8, avgSpend: 800 },
    { type: "social_media", convRate: 2.1, ctr: 1.9, avgSpend: 1200 },
    { type: "search", convRate: 5.2, ctr: 3.8, avgSpend: 1500 },
    { type: "display", convRate: 1.2, ctr: 0.9, avgSpend: 900 },
    { type: "referral", convRate: 8.5, ctr: 7.2, avgSpend: 600 },
  ];

  // Generate 20 campaigns with different statuses and performance
  const campaigns = [];

  // Ensure at least 4 of each type
  campaignTypes.forEach((campaignType, typeIndex) => {
    for (let i = 0; i < 4; i++) {
      const startDateOffset = Math.floor(Math.random() * 150); // Random day in last 5 months
      const startDate = subDays(now, startDateOffset);
      const endDateOffset = Math.min(startDateOffset - 15, 0); // Campaign lasts 15-30 days
      const endDate = subDays(now, endDateOffset);

      // Determine status based on dates
      let status;
      if (startDate > now) {
        status = "scheduled";
      } else if (endDate < now) {
        status = "completed";
      } else {
        status = ["active", "paused"][Math.floor(Math.random() * 2)];
      }

      // Random variation in metrics
      const variationFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2 range

      // Budget and spend based on status
      const budget = Math.floor(campaignType.avgSpend * variationFactor);
      let spent;

      if (status === "scheduled") {
        spent = 0;
      } else if (status === "completed") {
        spent = budget * (0.9 + Math.random() * 0.2); // 90-110% of budget
      } else if (status === "active") {
        spent = budget * (0.3 + Math.random() * 0.5); // 30-80% of budget
      } else {
        // paused
        spent = budget * (0.1 + Math.random() * 0.4); // 10-50% of budget
      }

      // Performance metrics
      const impressions = Math.floor(budget * 80 + Math.random() * budget * 40);
      const ctr = campaignType.ctr * variationFactor;
      const clicks = Math.floor(impressions * (ctr / 100));
      const convRate = campaignType.convRate * variationFactor;
      const conversions = Math.floor(clicks * (convRate / 100));

      campaigns.push({
        id: `campaign-${typeIndex}-${i}`,
        name: `${campaignType.type
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")} Campaign ${i + 1}`,
        type: campaignType.type,
        status,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        budget,
        spent: Math.floor(spent),
        description: `Marketing campaign for ${campaignType.type}`,
        target: {
          audience: ["new_customers", "returning_customers", "all"][
            Math.floor(Math.random() * 3)
          ],
          regions: ["US", "Europe", "Asia", "Global"][
            Math.floor(Math.random() * 4)
          ],
        },
        performance: {
          impressions,
          clicks,
          conversions,
          roi: parseFloat(((conversions * 45) / spent).toFixed(2)), // Assuming $45 value per conversion
        },
      });
    }
  });

  return campaigns;
};

// SECTION 4: CMS CONTENT DATA
/**
 * Generate rich content data for CMS dashboard
 */
export const generateCMSContent = () => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);

  const contentTypes = [
    "product_page",
    "category_page",
    "blog_post",
    "banner",
    "promotion",
  ];

  const statusOptions = ["draft", "scheduled", "published", "archived"];
  const authors = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Jessica Williams",
    "David Miller",
  ];

  const content = [];

  // Generate content entries
  for (let i = 0; i < 50; i++) {
    const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const status =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];

    const createdOffset = Math.floor(Math.random() * 150); // Random day in last 5 months
    const createdAt = subDays(now, createdOffset);

    let publishedAt = null;
    let scheduledAt = null;

    if (status === "published") {
      publishedAt = subDays(now, Math.floor(Math.random() * createdOffset));
    } else if (status === "scheduled") {
      scheduledAt = addDays(now, Math.floor(Math.random() * 30) + 1);
    }

    // Generate updates within a reasonable timeframe
    const updatedAt = subDays(
      now,
      Math.floor(Math.random() * Math.min(createdOffset, 30))
    );

    content.push({
      id: `content-${i + 1}`,
      title: `${type
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")} ${i + 1}`,
      type,
      status,
      createdAt: createdAt.toISOString(),
      publishedAt: publishedAt ? publishedAt.toISOString() : null,
      scheduledAt: scheduledAt ? scheduledAt.toISOString() : null,
      updatedAt: updatedAt.toISOString(),
      author: authors[Math.floor(Math.random() * authors.length)],
      content: `This is sample content for ${type}. It contains important information that would typically be displayed on the website.`,
      seo: {
        metaTitle: `Meta Title for ${type} ${i + 1}`,
        metaDescription: `Meta description for ${type} ${
          i + 1
        } with important keywords for better search engine ranking.`,
        keywords: ["ecommerce", "products", "online shopping"],
      },
      // Every 3rd content has media
      media:
        i % 3 === 0
          ? [`https://picsum.photos/seed/content-${i + 1}/800/600`]
          : [],
    });
  }

  return content;
};

// SECTION 5: USER DATA
/**
 * Generate meaningful user data for customer summaries and activity charts
 */
export const generateUserData = () => {
  const now = new Date();
  const oneYearAgo = subMonths(now, 12);

  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "James",
    "Emma",
    "Robert",
    "Olivia",
    "William",
    "Sophia",
    "Joseph",
    "Isabella",
    "Thomas",
    "Mia",
    "Charles",
    "Charlotte",
    "Daniel",
    "Amelia",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
    "Martinez",
    "Anderson",
    "Taylor",
    "Thomas",
    "Hernandez",
    "Moore",
    "Martin",
    "Jackson",
    "Thompson",
    "White",
  ];

  const users = [];

  // Generate 100 users with varied profiles
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    // Create joined date - distribute across the year
    const joinedOffset = Math.floor(Math.random() * 365);
    const joinedDate = subDays(now, joinedOffset);

    // Determine if active based on recency
    const isActive = joinedOffset < 180 || Math.random() < 0.7;

    // Last purchase should be after join date but before now
    const daysSinceJoined = Math.min(joinedOffset, 180); // Cap at 6 months for reasonable last purchase
    const lastPurchaseOffset = Math.floor(Math.random() * daysSinceJoined);
    const lastPurchaseDate = subDays(now, lastPurchaseOffset);

    // Create user data
    const totalOrders = isActive
      ? Math.floor(Math.random() * 15) + 1
      : Math.floor(Math.random() * 3) + 1;

    const avgOrderValue = 50 + Math.floor(Math.random() * 200);
    const totalSpent = avgOrderValue * totalOrders;

    users.push({
      id: `customer-${i + 1}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`,
      address: {
        street: `${Math.floor(Math.random() * 9000) + 1000} Main St`,
        city: [
          "New York",
          "Los Angeles",
          "Chicago",
          "Houston",
          "Phoenix",
          "Philadelphia",
        ][Math.floor(Math.random() * 6)],
        state: ["NY", "CA", "IL", "TX", "AZ", "PA"][
          Math.floor(Math.random() * 6)
        ],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "USA",
      },
      createdAt: joinedDate.toISOString(),
      lastPurchase: lastPurchaseDate.toISOString(),
      totalSpent,
      totalOrders,
      status: isActive ? "active" : "inactive",
    });
  }

  return users;
};

/**
 * Precalculate financial metrics for monthly data charts
 */
function calculateMonthlyFinancials(transactions) {
  // Get date range
  const dates = transactions.map((t) => new Date(t.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Create month intervals
  const months = eachMonthOfInterval({
    start: minDate,
    end: maxDate,
  });

  // Calculate data for each month
  return months.map((month) => {
    const monthName = format(month, "MMM yyyy");
    const monthStart = new Date(month);
    const monthEnd = new Date(month);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    // Filter transactions for this month
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= monthStart && date < monthEnd;
    });

    // Calculate metrics
    const sales = monthTransactions
      .filter((t) => t.type === "sale")
      .reduce((sum, t) => sum + t.amount, 0);

    const refunds = monthTransactions
      .filter((t) => t.type === "refund")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = monthTransactions
      .filter((t) => t.type !== "sale" && t.type !== "refund")
      .reduce((sum, t) => sum + t.amount, 0);

    const revenue = sales - refunds;
    const profit = revenue - expenses;
    const grossMargin = revenue > 0 ? (revenue / sales) * 100 : 0;
    const netMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // Group expenses by category for breakdown
    const expenseBreakdown = {};
    monthTransactions
      .filter((t) => t.type !== "sale" && t.type !== "refund")
      .forEach((t) => {
        expenseBreakdown[t.type] = (expenseBreakdown[t.type] || 0) + t.amount;
      });

    return {
      name: monthName,
      revenue,
      refunds,
      expenses,
      profit,
      grossMargin,
      netMargin,
      expenseBreakdown,
    };
  });
}

/**
 * Pre-calculate user activity data for user charts
 */
function calculateUserActivityData(users) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);

  // Create month intervals
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now,
  });

  // Calculate user metrics for each month
  return months.map((month) => {
    const monthName = format(month, "MMM yyyy");
    const monthStart = new Date(month);
    const monthEnd = new Date(month);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    // New users this month
    const newUsers = users.filter((user) => {
      const createdDate = new Date(user.createdAt);
      return createdDate >= monthStart && createdDate < monthEnd;
    }).length;

    // Active users (made a purchase this month)
    const activeUsers = users.filter((user) => {
      const lastPurchase = new Date(user.lastPurchase);
      return lastPurchase >= monthStart && lastPurchase < monthEnd;
    }).length;

    return {
      name: monthName,
      newCustomers: newUsers,
      activeCustomers: activeUsers,
    };
  });
}

/**
 * Force initialization of all chart data
 */
export const fixChartData = () => {
  console.log("Fixing all dashboard chart data...");

  // 1. Generate and store transactions
  const transactions = generateSampleTransactions(400);
  localStorage.setItem(
    "ecommerce_dashboard_transactions",
    JSON.stringify(transactions)
  );

  // 2. Calculate and store monthly financial data
  const monthlyFinancials = calculateMonthlyFinancials(transactions);
  localStorage.setItem(
    "ecommerce_dashboard_monthly_data",
    JSON.stringify(monthlyFinancials)
  );

  // 3. Generate and store product sales data
  const productSales = generateProductSalesData();
  localStorage.setItem(
    "ecommerce_dashboard_product_sales",
    JSON.stringify(productSales)
  );

  // 4. Generate and store marketing campaign data
  const marketingData = generateMarketingData();
  localStorage.setItem(
    "ecommerce_dashboard_campaigns",
    JSON.stringify(marketingData)
  );

  // 5. Generate and store CMS content data
  const cmsContent = generateCMSContent();
  localStorage.setItem(
    "ecommerce_dashboard_content",
    JSON.stringify(cmsContent)
  );

  // 6. Generate and store user data
  const userData = generateUserData();
  localStorage.setItem(
    "ecommerce_dashboard_customers",
    JSON.stringify(userData)
  );

  // 7. Calculate and store user activity data
  const userActivity = calculateUserActivityData(userData);
  localStorage.setItem(
    "ecommerce_dashboard_user_activity",
    JSON.stringify(userActivity)
  );

  console.log("All dashboard data fixed successfully");

  return {
    transactions,
    monthlyFinancials,
    productSales,
    marketingData,
    cmsContent,
    userData,
    userActivity,
  };
};

/**
 * Getter functions for pre-calculated data
 */
export const getMonthlyChartData = () => {
  let data = localStorage.getItem("ecommerce_dashboard_monthly_data");
  if (!data) {
    const result = fixChartData();
    return result.monthlyFinancials;
  }
  return JSON.parse(data);
};

export const getProductSalesData = () => {
  let data = localStorage.getItem("ecommerce_dashboard_product_sales");
  if (!data) {
    fixChartData();
    data = localStorage.getItem("ecommerce_dashboard_product_sales");
  }
  return JSON.parse(data);
};

export const getUserActivityData = () => {
  let data = localStorage.getItem("ecommerce_dashboard_user_activity");
  if (!data) {
    fixChartData();
    data = localStorage.getItem("ecommerce_dashboard_user_activity");
  }
  return JSON.parse(data);
};

export const getMarketingCampaigns = () => {
  let data = localStorage.getItem("ecommerce_dashboard_campaigns");
  if (!data) {
    fixChartData();
    data = localStorage.getItem("ecommerce_dashboard_campaigns");
  }
  return JSON.parse(data);
};
