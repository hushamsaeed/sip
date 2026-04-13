import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Users
  const passwordHash = await bcrypt.hash("admin123", 12);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@elact.co" },
      update: {},
      create: {
        email: "admin@elact.co",
        passwordHash,
        name: "Admin ELACT",
        role: "SUPER_ADMIN",
        avatarColor: "#F59E0B",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "husam@elact.co" },
      update: {},
      create: {
        email: "husam@elact.co",
        passwordHash,
        name: "Husain Mohamed",
        role: "SUPER_ADMIN",
        avatarColor: "#0EA5E9",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "aishath@elact.co" },
      update: {},
      create: {
        email: "aishath@elact.co",
        passwordHash,
        name: "Aishath Nazia",
        role: "MANAGER",
        avatarColor: "#2DD4BF",
        status: "ACTIVE",
      },
    }),
    prisma.user.upsert({
      where: { email: "mohamed@elact.co" },
      update: {},
      create: {
        email: "mohamed@elact.co",
        passwordHash,
        name: "Mohamed Fakhry",
        role: "MANAGER",
        avatarColor: "#EF4444",
        status: "OFFLINE",
      },
    }),
    prisma.user.upsert({
      where: { email: "fathimath@elact.co" },
      update: {},
      create: {
        email: "fathimath@elact.co",
        passwordHash,
        name: "Fathimath Shifa",
        role: "MANAGER",
        avatarColor: "#A855F7",
        status: "OFFLINE",
      },
    }),
    prisma.user.upsert({
      where: { email: "ibrahim@elact.co" },
      update: {},
      create: {
        email: "ibrahim@elact.co",
        passwordHash,
        name: "Ibrahim Rasheed",
        role: "VIEWER",
        avatarColor: "#6366F1",
        status: "INVITED",
      },
    }),
  ]);

  // Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "SIP-SPR-HN-001" },
      update: {},
      create: { name: "Hennessy XO Cognac", sku: "SIP-SPR-HN-001", brand: "Hennessy", category: "SPIRITS", description: "Premium XO Cognac with rich, complex flavors.", price: 285.00, stock: 124, status: "ACTIVE", tags: ["Premium", "Aged"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-CHP-DP-001" },
      update: {},
      create: { name: "Dom Perignon Vintage 2013", sku: "SIP-CHP-DP-001", brand: "Dom Perignon", category: "CHAMPAGNE", description: "Iconic vintage champagne.", price: 428.00, stock: 67, status: "ACTIVE", tags: ["Premium", "Limited Edition"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-GG-001" },
      update: {},
      create: { name: "Grey Goose Vodka", sku: "SIP-SPR-GG-001", brand: "Grey Goose", category: "SPIRITS", description: "French premium vodka.", price: 67.89, stock: 783, status: "ACTIVE", tags: ["Premium"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-WIN-CM-001" },
      update: {},
      create: { name: "Chateau Margaux 2015", sku: "SIP-WIN-CM-001", brand: "Chateau Margaux", category: "WINE", description: "First Growth Bordeaux.", price: 899.00, stock: 18, status: "ACTIVE", tags: ["Premium", "Aged"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-MC-001" },
      update: {},
      create: { name: "Macallan 18 Sherry Oak", sku: "SIP-SPR-MC-001", brand: "Macallan", category: "SPIRITS", description: "Single malt Scotch whisky aged 18 years.", price: 368.00, stock: 42, status: "ACTIVE", tags: ["Premium", "Aged"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-CHP-MC-001" },
      update: {},
      create: { name: "Moet & Chandon Imperial", sku: "SIP-CHP-MC-001", brand: "Moet & Chandon", category: "CHAMPAGNE", description: "Classic champagne.", price: 75.00, stock: 89, status: "ACTIVE", tags: ["Premium"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-JW-001" },
      update: {},
      create: { name: "Johnnie Walker Blue Label", sku: "SIP-SPR-JW-001", brand: "Johnnie Walker", category: "SPIRITS", description: "Ultra-premium blended Scotch whisky.", price: 245.00, stock: 56, status: "ACTIVE", tags: ["Premium"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-WIN-OA-001" },
      update: {},
      create: { name: "Opus One 2019", sku: "SIP-WIN-OA-001", brand: "Opus One", category: "WINE", description: "Napa Valley red blend.", price: 425.00, stock: 23, status: "ACTIVE", tags: ["Premium"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-BV-001" },
      update: {},
      create: { name: "Belvedere Vodka", sku: "SIP-SPR-BV-001", brand: "Belvedere", category: "SPIRITS", description: "Polish luxury vodka.", price: 42.00, stock: 0, status: "OUT_OF_STOCK", tags: [] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-BER-CO-001" },
      update: {},
      create: { name: "Corona Extra", sku: "SIP-BER-CO-001", brand: "Corona", category: "BEER", description: "Mexican pale lager.", price: 3.50, stock: 1200, status: "ACTIVE", tags: [] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-PC-001" },
      update: {},
      create: { name: "Patron Silver Tequila", sku: "SIP-SPR-PC-001", brand: "Patron", category: "SPIRITS", description: "Premium silver tequila.", price: 52.00, stock: 5, status: "LOW_STOCK", tags: ["Premium"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-WIN-PG-001" },
      update: {},
      create: { name: "Penfolds Grange 2018", sku: "SIP-WIN-PG-001", brand: "Penfolds", category: "WINE", description: "Australia's most iconic wine.", price: 750.00, stock: 8, status: "ACTIVE", tags: ["Premium", "Aged", "Limited Edition"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-CHP-VP-001" },
      update: {},
      create: { name: "Veuve Clicquot Yellow Label", sku: "SIP-CHP-VP-001", brand: "Veuve Clicquot", category: "CHAMPAGNE", description: "Classic champagne brut.", price: 65.00, stock: 145, status: "ACTIVE", tags: [] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-SPR-RM-001" },
      update: {},
      create: { name: "Remy Martin XO", sku: "SIP-SPR-RM-001", brand: "Remy Martin", category: "SPIRITS", description: "Fine Champagne Cognac XO.", price: 198.00, stock: 67, status: "ACTIVE", tags: ["Premium", "Aged"] },
    }),
    prisma.product.upsert({
      where: { sku: "SIP-BER-HK-001" },
      update: {},
      create: { name: "Heineken Premium", sku: "SIP-BER-HK-001", brand: "Heineken", category: "BEER", description: "Dutch pale lager.", price: 2.80, stock: 2400, status: "ACTIVE", tags: [] },
    }),
  ]);

  // Clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: "client-soneva" },
      update: {},
      create: { id: "client-soneva", name: "Soneva Fushi", type: "RESORT", atoll: "Baa Atoll", island: "Kunfunadhoo", contactPerson: "Ahmed Rizal", phone: "+960 660-0304", email: "beverage@sonevafushi.com", avatarColor: "#F59E0B" },
    }),
    prisma.client.upsert({
      where: { id: "client-waldorf" },
      update: {},
      create: { id: "client-waldorf", name: "Waldorf Astoria Ithaafushi", type: "RESORT", atoll: "South Male Atoll", island: "Ithaafushi", contactPerson: "Sarah Chen", phone: "+960 400-1100", email: "fb@waldorfmaldives.com", avatarColor: "#0EA5E9" },
    }),
    prisma.client.upsert({
      where: { id: "client-stregis" },
      update: {},
      create: { id: "client-stregis", name: "St. Regis Vommuli", type: "RESORT", atoll: "Dhaalu Atoll", island: "Vommuli", contactPerson: "James Park", phone: "+960 676-6333", email: "butler@stregismaldives.com", avatarColor: "#2DD4BF" },
    }),
    prisma.client.upsert({
      where: { id: "client-anantara" },
      update: {},
      create: { id: "client-anantara", name: "Anantara Kihavah Villas", type: "RESORT", atoll: "Baa Atoll", island: "Kihavah Huravalhi", contactPerson: "Mia Torres", phone: "+960 660-1020", email: "dining@anantarakihavah.com", avatarColor: "#A855F7" },
    }),
    prisma.client.upsert({
      where: { id: "client-scubaspa" },
      update: {},
      create: { id: "client-scubaspa", name: "Scubaspa Ying Liveaboard", type: "LIVEABOARD", atoll: "Multi Atoll Route", contactPerson: "Kai Nakamura", phone: "+960 332-7788", email: "ops@scubaspa.com", avatarColor: "#EF4444", status: "SUSPENDED" },
    }),
    prisma.client.upsert({
      where: { id: "client-ritzcarlton" },
      update: {},
      create: { id: "client-ritzcarlton", name: "Ritz-Carlton Fari Islands", type: "RESORT", atoll: "North Male Atoll", island: "Fari Islands", contactPerson: "David Kim", phone: "+960 400-8888", email: "food@ritzcarltonmaldives.com", avatarColor: "#6366F1" },
    }),
    prisma.client.upsert({
      where: { id: "client-fourseasons" },
      update: {},
      create: { id: "client-fourseasons", name: "Four Seasons Landaa", type: "RESORT", atoll: "Baa Atoll", island: "Landaa Giraavaru", contactPerson: "Lisa Wang", phone: "+960 660-0888", email: "dining@fourseasonsmaldives.com", avatarColor: "#0EA5E9" },
    }),
    prisma.client.upsert({
      where: { id: "client-como" },
      update: {},
      create: { id: "client-como", name: "COMO Cocoa Island", type: "RESORT", atoll: "South Male Atoll", island: "Makunufushi", contactPerson: "Ryan Adams", phone: "+960 664-1818", email: "fb@comohotels.com", avatarColor: "#2DD4BF" },
    }),
  ]);

  // Orders
  const orders = await Promise.all([
    createOrder("SIP-2025-1241", "client-soneva", "DELIVERED", [
      { productSku: "SIP-SPR-HN-001", qty: 24 },
      { productSku: "SIP-CHP-DP-001", qty: 12 },
    ]),
    createOrder("SIP-2025-1242", "client-waldorf", "IN_TRANSIT", [
      { productSku: "SIP-SPR-GG-001", qty: 18 },
      { productSku: "SIP-CHP-MC-001", qty: 6 },
    ]),
    createOrder("SIP-2025-1243", "client-stregis", "PROCESSING", [
      { productSku: "SIP-SPR-MC-001", qty: 6 },
      { productSku: "SIP-WIN-CM-001", qty: 3 },
    ]),
    createOrder("SIP-2025-1244", "client-ritzcarlton", "DELIVERED", [
      { productSku: "SIP-SPR-JW-001", qty: 12 },
      { productSku: "SIP-BER-CO-001", qty: 480 },
    ]),
    createOrder("SIP-2025-1245", "client-anantara", "IN_TRANSIT", [
      { productSku: "SIP-CHP-VP-001", qty: 24 },
      { productSku: "SIP-SPR-RM-001", qty: 12 },
    ]),
    createOrder("SIP-2025-1246", "client-waldorf", "IN_TRANSIT", [
      { productSku: "SIP-SPR-HN-001", qty: 6 },
      { productSku: "SIP-CHP-DP-001", qty: 4 },
      { productSku: "SIP-SPR-MC-001", qty: 3 },
      { productSku: "SIP-SPR-GG-001", qty: 12 },
      { productSku: "SIP-CHP-MC-001", qty: 5 },
    ]),
    createOrder("SIP-2025-1247", "client-fourseasons", "PROCESSING", [
      { productSku: "SIP-WIN-OA-001", qty: 9 },
      { productSku: "SIP-SPR-PC-001", qty: 6 },
    ]),
    createOrder("SIP-2025-1248", "client-como", "DELIVERED", [
      { productSku: "SIP-BER-HK-001", qty: 240 },
      { productSku: "SIP-SPR-GG-001", qty: 6 },
    ]),
  ]);

  // Order Timelines
  for (const order of orders) {
    await prisma.orderTimeline.createMany({
      data: [
        { orderId: order.id, event: "Order Placed", description: `Order ${order.orderNumber} created`, timestamp: order.createdAt },
        { orderId: order.id, event: "Processing", description: "Order is being prepared", timestamp: new Date(order.createdAt.getTime() + 3600000) },
        ...(order.status !== "PROCESSING"
          ? [{ orderId: order.id, event: "Shipped via Speedboat", description: "Speedboat Express", timestamp: new Date(order.createdAt.getTime() + 86400000) }]
          : []),
        ...(order.status === "DELIVERED"
          ? [{ orderId: order.id, event: "Delivered to Resort", description: `Delivered to ${order.deliveryTo || "resort"}`, timestamp: new Date(order.createdAt.getTime() + 172800000) }]
          : []),
      ],
    });
  }

  // Invoices for delivered orders
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED");
  for (let i = 0; i < deliveredOrders.length; i++) {
    const order = deliveredOrders[i];
    await prisma.invoice.upsert({
      where: { orderId: order.id },
      update: {},
      create: {
        orderId: order.id,
        invoiceNumber: `INV-2025-${String(412 + i).padStart(4, "0")}`,
        dueDate: new Date(Date.now() + 15 * 86400000),
        terms: "Net 15",
        paymentMethod: "Bank Transfer",
      },
    });
  }

  // Content Sections
  const contentSections = [
    {
      slug: "hero",
      title: "Hero Section",
      fields: {
        headline: "Paradise Poured to Perfection",
        subtitle: "The Maldives' exclusive premium spirits distributor — delivering world-class beverages to luxury resorts & liveaboards across the archipelago.",
        ctaText: "Explore Our Collection",
        ctaLink: "#products",
        backgroundImage: "/images/generated-1776098089280.png",
      },
    },
    {
      slug: "about",
      title: "About Section",
      fields: {
        headline: "Born from the Indian Ocean",
        description: "SIP was founded with a singular vision — to bring the world's finest spirits to the most exclusive destinations in the Maldives.",
        features: [
          { title: "Curated Portfolio", description: "Hand-selected premium spirits from renowned distilleries worldwide.", icon: "wine" },
          { title: "Island-First Logistics", description: "Purpose-built cold chain logistics designed for atoll-to-atoll delivery.", icon: "ship" },
          { title: "White-Glove Service", description: "Dedicated account managers for each resort partner.", icon: "award" },
        ],
      },
    },
    {
      slug: "services",
      title: "Services",
      fields: {
        headline: "Our Services",
        items: [
          "Premium spirits procurement and distribution",
          "Custom curated beverage programs",
          "Temperature-controlled logistics",
          "Dedicated account management",
        ],
      },
    },
    {
      slug: "infrastructure",
      title: "Infrastructure",
      fields: {
        headline: "Island-Grade Infrastructure",
        description: "State-of-the-art temperature-controlled warehousing and speedboat logistics network spanning the Maldives.",
        images: ["/images/generated-1776098164007.png", "/images/generated-1776098180610.png"],
      },
    },
    {
      slug: "contact",
      title: "Contact & Footer",
      fields: {
        ctaHeadline: "Ready to Elevate Your Island Experience?",
        ctaDescription: "Partner with SIP to bring world-class spirits to your resort or liveaboard.",
        ctaButtonText: "Get in Touch",
        ctaButtonLink: "mailto:sales@elact.co",
        companyName: "SIP by ELACT PVT LTD",
        address: "M. Thunaabage, Muranga Magu, Male', Republic of Maldives",
        phone: "+960 332 1010",
        email: "info@elact.co",
      },
    },
  ];

  for (const section of contentSections) {
    await prisma.contentSection.upsert({
      where: { slug: section.slug },
      update: { fields: section.fields },
      create: { ...section, status: "PUBLISHED", publishedAt: new Date() },
    });
  }

  // Settings
  const settings = [
    { key: "company_profile", value: { companyName: "SIP by ELACT PVT LTD", registration: "C0876/2020", address: "M.Thunaabage, Muranga Magu, Male'", primaryEmail: "sales@elact.co", secondaryEmail: "info@elact.co", phone: "+960 332 1010" } },
    { key: "warehouse", value: { temperatureRange: "16-22°C", humidity: "45-55%", storageCapacity: "10,000 units" } },
    { key: "notifications", value: { newOrderAlerts: true, lowStockWarnings: true, deliveryConfirmations: true, monthlyReports: false } },
  ];

  for (const s of settings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Seed complete!");
}

async function createOrder(
  orderNumber: string,
  clientId: string,
  status: "PROCESSING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED",
  items: { productSku: string; qty: number }[]
) {
  const productRecords = await Promise.all(
    items.map((i) => prisma.product.findUnique({ where: { sku: i.productSku } }))
  );

  const client = await prisma.client.findUnique({ where: { id: clientId } });

  const order = await prisma.order.upsert({
    where: { orderNumber },
    update: {},
    create: {
      orderNumber,
      clientId,
      status,
      carrier: "Speedboat Express",
      trackingNumber: `SB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      deliveryTo: `Male Port Terminal → ${client?.name}`,
      shippingCost: 345.00,
      taxAmount: status === "DELIVERED" ? 0 : 0,
      notes: status === "IN_TRANSIT" ? "Priority delivery requested. Ensure temperature-controlled container for champagne." : undefined,
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000),
      items: {
        create: items.map((item, idx) => ({
          productId: productRecords[idx]!.id,
          quantity: item.qty,
          unitPrice: productRecords[idx]!.price,
        })),
      },
    },
    include: { items: true },
  });

  return order;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
