import Image from "next/image";
import { Wine, Ship, Award, Thermometer, Warehouse, Truck } from "lucide-react";
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
  const about = content.about || {};
  const infra = content.infrastructure || {};
  const contact = content.contact || {};

  const features = (about.features as Array<{title: string; description: string; icon: string}>) || [
    { title: "Curated Portfolio", description: "Hand-selected premium spirits from renowned distilleries worldwide.", icon: "wine" },
    { title: "Island-First Logistics", description: "Purpose-built cold chain logistics designed for atoll-to-atoll delivery.", icon: "ship" },
    { title: "White-Glove Service", description: "Dedicated account managers for each resort partner.", icon: "award" },
  ];

  const featureIcons: Record<string, React.ReactNode> = {
    wine: <Wine className="w-8 h-8 text-sip-amber" />,
    ship: <Ship className="w-8 h-8 text-sip-amber" />,
    award: <Award className="w-8 h-8 text-sip-amber" />,
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={(hero.backgroundImage as string) || "/images/generated-1776098089280.png"}
            alt="SIP Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sip-bg-primary/60 via-sip-bg-primary/30 to-sip-bg-primary" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 italic">
            {(hero.headline as string) || "Paradise Poured to Perfection"}
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {(hero.subtitle as string) || "The Maldives' exclusive premium spirits distributor — delivering world-class beverages to luxury resorts & liveaboards across the archipelago."}
          </p>
          <a
            href={(hero.ctaLink as string) || "#about"}
            className="inline-block bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
          >
            {(hero.ctaText as string) || "Explore Our Collection"}
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-white mb-4 italic">
              {(about.headline as string) || "Born from the Indian Ocean"}
            </h2>
            <p className="text-sip-text-secondary max-w-2xl mx-auto">
              {(about.description as string) || "SIP was founded with a singular vision — to bring the world's finest spirits to the most exclusive destinations in the Maldives."}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-sip-card border border-sip-border-card rounded-xl p-8 text-center hover:border-sip-amber/30 transition-colors"
              >
                <div className="flex justify-center mb-4">
                  {featureIcons[feature.icon] || <Wine className="w-8 h-8 text-sip-amber" />}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sip-text-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="py-20 px-6 bg-sip-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-white mb-4 italic">
              {(infra.headline as string) || "Island-Grade Infrastructure"}
            </h2>
            <p className="text-sip-text-secondary max-w-2xl mx-auto">
              {(infra.description as string) || "State-of-the-art temperature-controlled warehousing and speedboat logistics network spanning the Maldives."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/generated-1776098164007.png"
                alt="Infrastructure"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/generated-1776098180610.png"
                alt="Logistics"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 flex items-center gap-4">
              <Thermometer className="w-8 h-8 text-sip-blue" />
              <div>
                <p className="text-white font-semibold">16-22&deg;C</p>
                <p className="text-sip-text-muted text-xs">Climate Controlled</p>
              </div>
            </div>
            <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 flex items-center gap-4">
              <Warehouse className="w-8 h-8 text-sip-teal" />
              <div>
                <p className="text-white font-semibold">10,000+ Units</p>
                <p className="text-sip-text-muted text-xs">Storage Capacity</p>
              </div>
            </div>
            <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 flex items-center gap-4">
              <Truck className="w-8 h-8 text-sip-amber" />
              <div>
                <p className="text-white font-semibold">Daily Deliveries</p>
                <p className="text-sip-text-muted text-xs">Speedboat Network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-white mb-4 italic">
              The Maldives&apos; Most Trusted Pour
            </h2>
          </div>
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
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 bg-sip-bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-bold text-white mb-4 italic">
            {(contact.ctaHeadline as string) || "Ready to Elevate Your Island Experience?"}
          </h2>
          <p className="text-sip-text-secondary mb-8">
            {(contact.ctaDescription as string) || "Partner with SIP to bring world-class spirits to your resort or liveaboard."}
          </p>
          <a
            href={(contact.ctaButtonLink as string) || "mailto:sales@elact.co"}
            className="inline-block bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary font-semibold px-8 py-3.5 rounded-lg transition-colors text-lg"
          >
            {(contact.ctaButtonText as string) || "Get in Touch"}
          </a>
        </div>
      </section>
    </>
  );
}
