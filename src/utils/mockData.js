// src/utils/mockData.js
import { subDays, format, addDays } from "date-fns";

// Generate random number between min and max (inclusive)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random float with 2 decimal places
const randomPrice = (min, max) =>
  (Math.random() * (max - min) + min).toFixed(2);

// Generate random date within the last n days
const randomDate = (days) => {
  const date = subDays(new Date(), randomInt(0, days));
  return format(date, "yyyy-MM-dd");
};

// Generate future date within the next n days
const randomFutureDate = (days) => {
  const date = addDays(new Date(), randomInt(1, days));
  return format(date, "yyyy-MM-dd");
};

// Generate random order status
const randomOrderStatus = () => {
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];
  return statuses[randomInt(0, statuses.length - 1)];
};

// Generate random payment method
const randomPaymentMethod = () => {
  const methods = [
    "credit_card",
    "paypal",
    "bank_transfer",
    "cash_on_delivery",
  ];
  return methods[randomInt(0, methods.length - 1)];
};

// Generate random product category
const randomCategory = () => {
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Books",
    "Sports",
  ];
  return categories[randomInt(0, categories.length - 1)];
};

// Generate random product name
const randomProductName = (category) => {
  const names = {
    Electronics: [
      "Bluetooth Headphones",
      "Wireless Charger",
      "Smart Watch",
      "Laptop",
      "Tablet",
      "Smartphone",
      "Wireless Mouse",
      "Gaming Keyboard",
      "USB-C Hub",
      "Portable SSD",
    ],
    Clothing: [
      "T-Shirt",
      "Jeans",
      "Hoodie",
      "Dress",
      "Jacket",
      "Socks",
      "Hat",
      "Sneakers",
      "Sweatpants",
      "Scarf",
    ],
    "Home & Kitchen": [
      "Coffee Maker",
      "Blender",
      "Toaster",
      "Microwave",
      "Air Fryer",
      "Food Processor",
      "Knife Set",
      "Cookware Set",
      "Vacuum Cleaner",
      "Bed Sheets",
    ],
    Beauty: [
      "Face Cream",
      "Shampoo",
      "Conditioner",
      "Lipstick",
      "Foundation",
      "Mascara",
      "Perfume",
      "Face Mask",
      "Hair Dryer",
      "Nail Polish",
    ],
    Books: [
      "Fiction Novel",
      "Cookbook",
      "Self-Help Book",
      "Biography",
      "Fantasy Book",
      "History Book",
      "Science Book",
      "Art Book",
      "Children's Book",
      "Reference Book",
    ],
    Sports: [
      "Yoga Mat",
      "Dumbbells",
      "Exercise Bike",
      "Running Shoes",
      "Basketball",
      "Tennis Racket",
      "Golf Clubs",
      "Swimming Goggles",
      "Fitness Tracker",
      "Resistance Bands",
    ],
  };

  return names[category][randomInt(0, names[category].length - 1)];
};

// Generate random user name
const randomUserName = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "David",
    "Sarah",
    "Chris",
    "Amanda",
    "Robert",
    "Olivia",
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
  ];

  return `${firstNames[randomInt(0, firstNames.length - 1)]} ${
    lastNames[randomInt(0, lastNames.length - 1)]
  }`;
};

// Generate random email based on name
const randomEmail = (name) => {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];
  const nameParts = name.toLowerCase().split(" ").join(".");
  return `${nameParts}@${domains[randomInt(0, domains.length - 1)]}`;
};

// Generate random address
const randomAddress = () => {
  const streets = [
    "Main St",
    "Oak Ave",
    "Maple Ln",
    "Broadway",
    "Park Ave",
    "Cedar Rd",
    "Elm St",
    "Washington St",
  ];
  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
  ];
  const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA"];
  const zipCodes = [
    "10001",
    "90001",
    "60601",
    "77001",
    "85001",
    "19101",
    "78201",
    "92101",
  ];

  const index = randomInt(0, cities.length - 1);
  return {
    street: `${randomInt(100, 999)} ${
      streets[randomInt(0, streets.length - 1)]
    }`,
    city: cities[index],
    state: states[index],
    zipCode: zipCodes[index],
    country: "USA",
  };
};

// Generate random phone number
const randomPhone = () => {
  return `(${randomInt(100, 999)}) ${randomInt(100, 999)}-${randomInt(
    1000,
    9999
  )}`;
};

// Generate random transaction type
const randomTransactionType = () => {
  const types = ["sale", "refund", "subscription", "shipping", "tax"];
  return types[randomInt(0, types.length - 1)];
};

// Generate random campaign type
const randomCampaignType = () => {
  const types = ["email", "social_media", "search", "display", "referral"];
  return types[randomInt(0, types.length - 1)];
};

// Generate random campaign status
const randomCampaignStatus = () => {
  const statuses = ["draft", "scheduled", "active", "paused", "completed"];
  return statuses[randomInt(0, statuses.length - 1)];
};

// Generate random content type
const randomContentType = () => {
  const types = [
    "product_page",
    "category_page",
    "blog_post",
    "banner",
    "promotion",
  ];
  return types[randomInt(0, types.length - 1)];
};

// Generate random content status
const randomContentStatus = () => {
  const statuses = ["draft", "scheduled", "published", "archived"];
  return statuses[randomInt(0, statuses.length - 1)];
};

// Main function to generate mock data
export const generateMockData = () => {
  // Generate products
  const products = [];
  for (let i = 0; i < 50; i++) {
    const category = randomCategory();
    const name = randomProductName(category);
    const cost = parseFloat(randomPrice(10, 100));
    const price = parseFloat((cost * (1 + randomInt(20, 50) / 100)).toFixed(2)); // 20-50% markup

    products.push({
      id: `product-${i + 1}`,
      name,
      category,
      description: `High-quality ${name.toLowerCase()} with premium features.`,
      price,
      cost,
      stock: randomInt(0, 100),
      sku: `SKU-${(i + 1).toString().padStart(5, "0")}`,
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
      images: [`https://picsum.photos/seed/${i + 1}/400/400`],
      specifications: {
        weight: `${randomInt(1, 10)} lbs`,
        dimensions: `${randomInt(1, 20)}x${randomInt(1, 20)}x${randomInt(
          1,
          20
        )} inches`,
        color: ["Red", "Blue", "Green", "Black", "White"][randomInt(0, 4)],
      },
      rating: parseFloat((randomInt(30, 50) / 10).toFixed(1)), // 3.0 - 5.0
      salesCount: randomInt(0, 1000),
    });
  }

  // Generate customers
  const customers = [];
  for (let i = 0; i < 50; i++) {
    const name = randomUserName();

    customers.push({
      id: `customer-${i + 1}`,
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      address: randomAddress(),
      createdAt: randomDate(365),
      lastPurchase: randomDate(60),
      totalSpent: parseFloat(randomPrice(100, 5000)),
      totalOrders: randomInt(1, 20),
      status: ["active", "inactive"][randomInt(0, 1)],
    });
  }

  // Generate orders
  const orders = [];
  for (let i = 0; i < 100; i++) {
    const customer = customers[randomInt(0, customers.length - 1)];
    const orderDate = randomDate(90);
    const status = randomOrderStatus();
    const orderItems = [];
    const itemCount = randomInt(1, 5);

    let subtotal = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = products[randomInt(0, products.length - 1)];
      const quantity = randomInt(1, 3);
      const price = parseFloat(product.price);
      const total = price * quantity;

      orderItems.push({
        product: {
          id: product.id,
          name: product.name,
          price,
          sku: product.sku,
        },
        quantity,
        price,
        total,
      });

      subtotal += total;
    }

    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const shipping = parseFloat(randomPrice(5, 15));
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));

    orders.push({
      id: `order-${i + 1}`,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      status,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: randomPaymentMethod(),
      shippingAddress: customer.address,
      createdAt: orderDate,
      updatedAt: orderDate,
      shippedAt:
        status === "shipped" || status === "delivered" ? randomDate(30) : null,
      deliveredAt: status === "delivered" ? randomDate(15) : null,
    });
  }

  // Generate transactions
  const transactions = [];
  for (let i = 0; i < 200; i++) {
    const type = randomTransactionType();
    const amount =
      type === "refund"
        ? -parseFloat(randomPrice(10, 200))
        : parseFloat(randomPrice(10, 200));

    transactions.push({
      id: `transaction-${i + 1}`,
      type,
      amount,
      date: randomDate(90),
      description: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } transaction`,
      relatedTo:
        type === "sale" || type === "refund"
          ? `order-${randomInt(1, 100)}`
          : null,
      paymentMethod: ["credit_card", "paypal", "bank_transfer"][
        randomInt(0, 2)
      ],
      status: ["completed", "pending", "failed"][randomInt(0, 2)],
    });
  }

  // Generate campaigns
  const campaigns = [];
  for (let i = 0; i < 20; i++) {
    const type = randomCampaignType();
    const status = randomCampaignStatus();
    const startDate = randomDate(60);

    campaigns.push({
      id: `campaign-${i + 1}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Campaign ${i + 1}`,
      type,
      status,
      startDate,
      endDate: status === "completed" ? randomDate(30) : randomFutureDate(30),
      budget: parseFloat(randomPrice(500, 5000)),
      spent:
        status === "completed"
          ? parseFloat(randomPrice(500, 5000))
          : parseFloat(randomPrice(0, 500)),
      description: `Marketing campaign for ${type}`,
      target: {
        audience: ["new_customers", "returning_customers", "all"][
          randomInt(0, 2)
        ],
        regions: ["US", "Europe", "Asia", "Global"][randomInt(0, 3)],
      },
      performance: {
        impressions: randomInt(1000, 100000),
        clicks: randomInt(100, 10000),
        conversions: randomInt(10, 1000),
        roi: parseFloat((randomInt(100, 500) / 100).toFixed(2)),
      },
    });
  }

  // Generate content
  const content = [];
  for (let i = 0; i < 30; i++) {
    const type = randomContentType();
    const status = randomContentStatus();

    content.push({
      id: `content-${i + 1}`,
      title: `${type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} ${i + 1}`,
      type,
      status,
      createdAt: randomDate(90),
      publishedAt: status === "published" ? randomDate(30) : null,
      scheduledAt: status === "scheduled" ? randomFutureDate(30) : null,
      updatedAt: randomDate(15),
      author: randomUserName(),
      content: `This is sample content for ${type}...`,
      seo: {
        metaTitle: `Meta Title for ${type} ${i + 1}`,
        metaDescription: `Meta description for ${type} ${
          i + 1
        } with important keywords.`,
        keywords: ["ecommerce", "products", "online shopping"],
      },
      media: [`https://picsum.photos/seed/content-${i + 1}/800/600`],
    });
  }

  return {
    products,
    customers,
    orders,
    transactions,
    campaigns,
    content,
  };
};
