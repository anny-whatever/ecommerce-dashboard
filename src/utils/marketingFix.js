// src/utils/marketingFix.js
export const fixMarketingDashboard = () => {
  console.log("Fixing marketing dashboard specifically...");

  // Generate campaign data with proper structure
  const campaigns = [];

  const campaignTypes = [
    { type: "email", name: "Email Newsletter" },
    { type: "social_media", name: "Facebook Ads" },
    { type: "search", name: "Google Search" },
    { type: "display", name: "Banner Ads" },
    { type: "referral", name: "Affiliate Program" },
  ];

  // Generate 5 campaigns for each type
  campaignTypes.forEach((campaign, index) => {
    for (let i = 0; i < 5; i++) {
      const impressions = Math.floor(Math.random() * 100000) + 1000;
      const clickRate = Math.random() * 5 + 0.5; // 0.5% to 5.5% CTR
      const clicks = Math.floor(impressions * (clickRate / 100));
      const convRate = Math.random() * 7 + 1; // 1% to 8% conversion rate
      const conversions = Math.floor(clicks * (convRate / 100));
      const spent = Math.floor(Math.random() * 5000) + 500;
      const roi = parseFloat(((conversions * 50) / spent).toFixed(2));

      campaigns.push({
        id: `campaign-${index}-${i}`,
        name: `${campaign.name} ${i + 1}`,
        type: campaign.type,
        status: ["active", "paused", "completed", "scheduled", "draft"][
          Math.floor(Math.random() * 5)
        ],
        startDate: new Date(2024, 0, 1).toISOString(),
        endDate: new Date(2024, 11, 31).toISOString(),
        budget: spent + Math.floor(Math.random() * 1000),
        spent: spent,
        description: `${campaign.name} marketing campaign ${i + 1}`,
        performance: {
          impressions,
          clicks,
          conversions,
          roi,
        },
      });
    }
  });

  // Store in localStorage
  localStorage.setItem(
    "ecommerce_dashboard_campaigns",
    JSON.stringify(campaigns)
  );

  // Create pre-calculated channel performance data
  const channelPerformance = campaignTypes.map((type) => {
    // Calculate totals for this type
    const typeCampaigns = campaigns.filter((c) => c.type === type.type);

    const impressions = typeCampaigns.reduce(
      (sum, c) => sum + c.performance.impressions,
      0
    );
    const clicks = typeCampaigns.reduce(
      (sum, c) => sum + c.performance.clicks,
      0
    );
    const conversions = typeCampaigns.reduce(
      (sum, c) => sum + c.performance.conversions,
      0
    );
    const spent = typeCampaigns.reduce((sum, c) => sum + c.spent, 0);

    return {
      name: type.name,
      type: type.type,
      impressions,
      clicks,
      conversions,
      spent,
    };
  });

  localStorage.setItem(
    "ecommerce_dashboard_channel_performance",
    JSON.stringify(channelPerformance)
  );
  console.log("Marketing dashboard fixed");

  return { campaigns, channelPerformance };
};
