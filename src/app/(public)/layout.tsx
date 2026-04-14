import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sip-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sip-bg-primary/80 backdrop-blur-md border-b border-sip-border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16 flex items-center justify-between h-[68px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/sip-logo-black.png"
              alt="SIP"
              width={40}
              height={40}
              className="invert brightness-200"
            />
          </Link>
          <div className="hidden md:flex items-center gap-9">
            <a href="#about" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Products</a>
            <a href="#about" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Services</a>
            <a href="#about" className="text-sm text-sip-text-secondary hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Contact</a>
          </div>
          <a
            href="#contact"
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-6 py-2.5 rounded transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t border-sip-border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
          {/* Footer Top - 4 Columns */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-16">
            {/* Brand Column */}
            <div className="space-y-4">
              <h3 className="font-heading text-4xl font-bold text-white italic">SIP</h3>
              <p className="text-sip-text-muted font-mono text-xs tracking-widest">
                by ELACT
              </p>
              <p className="text-sip-text-secondary text-sm leading-relaxed max-w-[320px]">
                The Maldives&apos; premier bonded warehouse and beverage
                distributor — delivering world-class spirits to luxury resorts
                and liveaboards across 26 atolls since 2023.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3.5">
              <h4 className="text-white text-sm font-semibold">Quick Links</h4>
              <a href="#" className="block text-sip-text-secondary text-sm hover:text-white transition-colors">Home</a>
              <a href="#about" className="block text-sip-text-secondary text-sm hover:text-white transition-colors">About Us</a>
              <a href="#about" className="block text-sip-text-secondary text-sm hover:text-white transition-colors">Services</a>
              <a href="#infrastructure" className="block text-sip-text-secondary text-sm hover:text-white transition-colors">Infrastructure</a>
              <a href="#contact" className="block text-sip-text-secondary text-sm hover:text-white transition-colors">Contact</a>
            </div>

            {/* Services */}
            <div className="space-y-3.5">
              <h4 className="text-white text-sm font-semibold">Services</h4>
              <p className="text-sip-text-secondary text-sm">Import &amp; Distribution</p>
              <p className="text-sip-text-secondary text-sm">Bonded Warehouse</p>
              <p className="text-sip-text-secondary text-sm">Resort Supply Chain</p>
              <p className="text-sip-text-secondary text-sm">Beverage Consulting</p>
            </div>

            {/* Contact */}
            <div className="space-y-3.5">
              <h4 className="text-white text-sm font-semibold">Contact</h4>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sip-amber shrink-0" />
                <span className="text-sip-text-secondary text-sm">sales@elact.co</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sip-amber shrink-0" />
                <span className="text-sip-text-secondary text-sm">info@elact.co</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sip-amber shrink-0" />
                <span className="text-sip-text-secondary text-sm">M.Tharaanaage, Muranga Magu, Malé</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-sip-border-subtle" />

          {/* Footer Bottom */}
          <div className="py-8 flex items-center justify-between">
            <p className="text-xs text-sip-text-muted">
              &copy; 2025 SIP by ELACT PVT LTD. All rights reserved.
            </p>
            <p className="text-xs text-sip-text-muted">
              Premium Spirits Distribution — Republic of Maldives
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
