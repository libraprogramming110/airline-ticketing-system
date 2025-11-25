import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#001d45] px-8 py-12 text-white md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <BrandSection />
          <QuickLinksSection />
          <SupportSection />
          <ContactsSection />
        </div>
      </div>
    </footer>
  );
}

function BrandSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">Omnira Airlines</h3>
      <p className="text-sm text-white/80">
        Your trusted partner for comfortable and affordable air travel
        worldwide.
      </p>
      <SocialLinks />
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-4">
      <a
        href="#"
        className="text-white/80 transition hover:text-white"
        aria-label="Facebook"
      >
        <FaFacebook className="h-5 w-5" />
      </a>
      <a
        href="#"
        className="text-white/80 transition hover:text-white"
        aria-label="Instagram"
      >
        <FaInstagram className="h-5 w-5" />
      </a>
      <a
        href="#"
        className="text-white/80 transition hover:text-white"
        aria-label="Twitter"
      >
        <FaTwitter className="h-5 w-5" />
      </a>
    </div>
  );
}

function QuickLinksSection() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Quick Links</h4>
      <nav className="flex flex-col gap-2 text-sm text-white/80">
        <a href="#" className="transition hover:text-white">
          Manage
        </a>
        <a href="#" className="transition hover:text-white">
          Blog
        </a>
      </nav>
    </div>
  );
}

function SupportSection() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Support</h4>
      <nav className="flex flex-col gap-2 text-sm text-white/80">
        <a href="#" className="transition hover:text-white">
          Help Center
        </a>
        <a href="#" className="transition hover:text-white">
          FAQs
        </a>
        <a href="#" className="transition hover:text-white">
          Contact Us
        </a>
        <a href="#" className="transition hover:text-white">
          Terms & Condition
        </a>
      </nav>
    </div>
  );
}

function ContactsSection() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Contacts</h4>
      <div className="space-y-2 text-sm text-white/80">
        <p>1234 Airport Blvd</p>
        <p>Cagayan de Oro Laguindingan Airport</p>
        <p>Phone: +63 9123 456 7890</p>
        <p>Email: info@omniraairlines.com</p>
      </div>
    </div>
  );
}

