import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sip-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-sip-bg-primary/80 backdrop-blur-md border-b border-sip-border-subtle">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/sip-logo-black.png"
              alt="SIP"
              width={36}
              height={36}
              className="invert brightness-200"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Products</a>
            <a href="#infrastructure" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Services</a>
            <a href="#about" className="text-sm text-sip-text-secondary hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-sm text-sip-text-secondary hover:text-white transition-colors">Contact</a>
          </div>
          <a
            href="#contact"
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Explore Our Collection
          </a>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-sip-bg-secondary border-t border-sip-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <Image
                src="/images/sip-logo-black.png"
                alt="SIP"
                width={48}
                height={48}
                className="invert brightness-200 mb-3"
              />
              <p className="text-sip-text-secondary text-sm max-w-xs">
                Premium spirits distribution serving the finest resorts across
                the Maldives.
              </p>
            </div>
            <div className="text-sm text-sip-text-muted">
              <p>SIP by ELACT PVT LTD</p>
              <p>M.Thunaabage, Muranga Magu</p>
              <p>Male&apos;, Republic of Maldives</p>
              <p className="mt-2">info@elact.co | +960 332 1010</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-sip-border-subtle text-center text-xs text-sip-text-muted">
            &copy; 2025 SIP by ELACT PVT LTD. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
