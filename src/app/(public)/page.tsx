export const dynamic = "force-dynamic";

import Image from "next/image";
import {
  Ship,
  Warehouse as WarehouseIcon,
  Sun,
  Lock,
  ScanBarcode,
  Waves,
  Gem,
  Anchor,
  Mail,
  MapPin,
} from "lucide-react";
import { prisma } from "@/lib/db";

async function getContent() {
  const sections = await prisma.contentSection.findMany({
    where: { status: "PUBLISHED" },
  });
  const map: Record<string, Record<string, unknown>> = {};
  for (const s of sections) {
    map[s.slug] = s.fields as Record<string, unknown>;
  }
  return map;
}

export default async function HomePage() {
  const content = await getContent();
  const hero = content.hero || {};
  const contact = content.contact || {};

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={(hero.backgroundImage as string) || "/images/generated-1776099099695.png"}
            alt="SIP Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#070F1C90_0%,#070F1CCC_100%)]" />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-7 italic leading-tight">
            {(hero.headline as string) || "Paradise Poured to Perfection"}
          </h1>
          <p className="text-[17px] text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            {(hero.subtitle as string) ||
              "The Maldives' exclusive premium spirits distributor — delivering world-class beverages to luxury resorts & liveaboards across the archipelago."}
          </p>
          <a
            href={(hero.ctaLink as string) || "#about"}
            className="inline-block bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary font-semibold px-8 py-3.5 rounded transition-colors"
          >
            {(hero.ctaText as string) || "Explore Our Collection"}
          </a>
        </div>
      </section>

      {/* About & Services Section */}
      <section id="about" className="py-20 lg:py-24 px-6 lg:px-16 bg-sip-bg-secondary">
        <div className="max-w-[1280px] mx-auto space-y-20">
          {/* About Row: Text + Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-heading text-4xl lg:text-[44px] font-medium text-white leading-tight">
                Born from the Indian Ocean
              </h2>
              <p className="text-sip-text-secondary text-base leading-[1.7]">
                Founded to serve the unique needs of the Maldivian archipelago&apos;s
                world-renowned luxury hospitality sector, SIP was born from a
                vision to deliver the finest spirits across turquoise waters.
                Operating from our state-of-the-art bonded warehouse, we curate
                premium beverages for the most exclusive resorts on earth.
              </p>
              <p className="text-sip-text-muted text-base leading-[1.7]">
                From the atolls of the north to the southern reaches of the
                archipelago, we are partners in crafting unforgettable guest
                experiences — ensuring every pour meets the exacting standards of
                Maldivian luxury hospitality.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src="/images/generated-1776099117486.png"
                alt="About SIP"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Services Row: 3 Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Ship className="w-10 h-10 text-sip-amber" />,
                title: "Import & Distribution",
                description:
                  "Curating and importing the world's most prestigious spirits, wines, and champagnes — delivered directly to Maldivian shores from renowned producers across the globe.",
              },
              {
                icon: <WarehouseIcon className="w-10 h-10 text-sip-amber" />,
                title: "Bonded Warehouse",
                description:
                  "Climate-controlled bonded warehouse facility on Thilafushi, ensuring optimal storage conditions and full regulatory compliance for all imported premium beverages.",
              },
              {
                icon: <Ship className="w-10 h-10 text-sip-amber" />,
                title: "Resort Supply Chain",
                description:
                  "Island-to-island delivery network spanning the archipelago — from seaplane logistics to speedboat transfers, we reach every atoll and resort with precision and care.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-sip-card border border-sip-border-card rounded-xl p-8 space-y-4"
              >
                {service.icon}
                <h3 className="font-heading text-[22px] font-medium text-white">
                  {service.title}
                </h3>
                <p className="text-sip-text-secondary text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="py-20 lg:py-24 px-6 lg:px-[120px] bg-sip-bg-secondary">
        <div className="max-w-[1280px] mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white italic">
              Island-Grade Infrastructure
            </h2>
            <p className="text-sip-text-secondary text-[17px] max-w-2xl mx-auto leading-relaxed">
              State-of-the-art temperature-controlled warehousing and speedboat
              logistics network spanning the Maldives.
            </p>
          </div>

          {/* Content: Large Image + Feature Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Large Warehouse Image */}
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/images/generated-1776099077824.png"
                alt="Bonded Warehouse"
                fill
                className="object-cover"
              />
            </div>

            {/* Feature Cards */}
            <div className="space-y-5">
              {[
                {
                  icon: <Sun className="w-6 h-6 text-sip-amber" />,
                  title: "Climate-Controlled Storage",
                  description:
                    "Tropical-grade temperature and humidity management, protecting premium spirits from the Maldivian heat across every atoll delivery.",
                },
                {
                  icon: <Lock className="w-6 h-6 text-sip-amber" />,
                  title: "Bonded Warehouse Security",
                  description:
                    "Fully compliant bonded facility at the heart of Malé, meeting international standards for secure beverage storage and customs clearance.",
                },
                {
                  icon: <ScanBarcode className="w-6 h-6 text-sip-amber" />,
                  title: "Smart Inventory Tracking",
                  description:
                    "Real-time visibility across our entire catalogue — track orders from warehouse to seaplane to your resort's bar counter.",
                },
                {
                  icon: <Waves className="w-6 h-6 text-sip-amber" />,
                  title: "Archipelago-Scale Capacity",
                  description:
                    "Built to serve the full Maldivian hospitality sector — from intimate boutique resorts to the largest luxury chains across 26 atolls.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-sip-card border border-sip-border-card rounded-lg p-6 flex items-start gap-5"
                >
                  <div className="w-14 h-14 rounded-full bg-sip-amber/10 flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-white font-semibold text-[17px]">
                      {feature.title}
                    </h3>
                    <p className="text-sip-text-secondary text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose SIP Section */}
      <section className="py-24 lg:py-[100px] px-6 lg:px-[120px]">
        <div className="max-w-[1280px] mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-sip-amber font-mono text-[13px] tracking-[3px] font-medium">
              WHY CHOOSE SIP
            </p>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white">
              The Maldives&apos; Most Trusted Pour
            </h2>
            <p className="text-sip-text-secondary text-[17px] max-w-[720px] mx-auto leading-relaxed">
              From Malé to the most remote atoll, we combine deep local knowledge
              with world-class logistics to keep the finest spirits flowing across
              the Maldivian archipelago.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "100+", label: "Resort Partners", color: "text-sip-amber" },
              { value: "50+", label: "Premium Brands", color: "text-sip-blue" },
              { value: "26", label: "Atolls Served", color: "text-sip-teal" },
              { value: "2021", label: "Established", color: "text-sip-amber" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-sip-card border border-sip-border-card rounded-xl p-8 text-center"
              >
                <p className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </p>
                <p className="text-sip-text-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pillars Row */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Gem className="w-8 h-8 text-sip-amber" />,
                title: "World-Class Selection",
                description:
                  "Curated for Maldivian luxury — we partner with renowned distilleries and vineyards to bring the world's finest spirits to your island paradise.",
                gradient: "from-[#F59E0B12] to-transparent",
              },
              {
                icon: <Ship className="w-8 h-8 text-sip-blue" />,
                title: "Island-to-Island Logistics",
                description:
                  "Seaplane, speedboat, or cargo vessel — our logistics network reaches every inhabited and resort island in the Maldivian archipelago, on time, every time.",
                gradient: "from-[#0EA5E912] to-transparent",
              },
              {
                icon: <Anchor className="w-8 h-8 text-sip-teal" />,
                title: "Malé Hub Advantage",
                description:
                  "Strategically located in the capital, our bonded warehouse sits at the crossroads of the Maldives' supply chain — connecting global imports to 1,200+ islands.",
                gradient: "from-[#2DD4BF12] to-transparent",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className={`bg-gradient-to-b ${pillar.gradient} border border-sip-border-card rounded-xl p-8 space-y-4`}
              >
                {pillar.icon}
                <h3 className="text-white font-semibold text-lg">
                  {pillar.title}
                </h3>
                <p className="text-sip-text-secondary text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-24 lg:py-[100px] px-6 lg:px-[120px] bg-gradient-to-b from-sip-bg-primary via-[#0B2A4A] to-sip-bg-primary"
      >
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <h2 className="font-heading text-4xl lg:text-[44px] font-bold text-white leading-[1.2] italic">
            {(contact.ctaHeadline as string) ||
              "Ready to Elevate Your\nIsland Experience?"}
          </h2>
          <p className="text-sip-text-secondary text-[17px] max-w-[640px] mx-auto leading-relaxed">
            {(contact.ctaDescription as string) ||
              "Partner with the Maldives' most trusted premium beverage distributor. Let's craft the perfect collection for your resort or liveaboard, delivered across the archipelago."}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={(contact.ctaButtonLink as string) || "mailto:sales@elact.co"}
              className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary font-semibold px-8 py-4 rounded transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="#about"
              className="border border-sip-text-secondary text-white font-medium px-8 py-4 rounded hover:border-white transition-colors"
            >
              View Catalogue
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
