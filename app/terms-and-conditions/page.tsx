import Footer from "@/components/footer";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using Omnira Airlines' services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Booking and Payment",
    content:
      "All bookings are subject to availability and confirmation. Prices are subject to change until payment is confirmed. We accept various payment methods and all transactions are processed securely.",
  },
  {
    title: "3. Cancellation and Refunds",
    content:
      "Cancellation policies vary by fare type. Refunds will be processed according to the fare rules applicable to your booking. Processing times may vary depending on the payment method used.",
  },
  {
    title: "4. Baggage Policy",
    content:
      "Baggage allowances are determined by fare type and route. Excess baggage fees apply. Prohibited items are not permitted in checked or carry-on baggage. Please review our baggage policy before travel.",
  },
  {
    title: "5. Check-in and Boarding",
    content:
      "Passengers must check in within the specified timeframes. Online check-in is available 24 hours before departure. Boarding gates close 30 minutes before scheduled departure time.",
  },
  {
    title: "6. Flight Changes and Delays",
    content:
      "We reserve the right to change flight schedules, aircraft, or routes. In case of delays or cancellations, we will provide alternative arrangements or refunds as per applicable regulations.",
  },
  {
    title: "7. Passenger Responsibilities",
    content:
      "Passengers are responsible for ensuring they have valid travel documents, arriving on time, and complying with all airline policies and regulations. Failure to comply may result in denied boarding.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "Omnira Airlines' liability is limited to the extent permitted by law. We are not liable for indirect, consequential, or incidental damages arising from travel disruptions beyond our control.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <PageHeader
            title="Terms and Conditions"
            description="Please read these terms carefully before using our services"
          />
          <TermsSections sections={sections} />
          <LastUpdatedSection />
        </div>
      </div>
      <Footer />
    </>
  );
}

function BackNavigation() {
  return (
    <header className="mb-12">
      <a
        href="/get-started"
        aria-label="Back to home"
        className="inline-flex items-center gap-3 transition hover:opacity-80"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#0047ab]"
        >
          <path
            d="M19 12H5M5 12l6-6m-6 6l6 6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-[#0047ab]">
          Back to Home
        </span>
      </a>
    </header>
  );
}

type PageHeaderProps = {
  title: string;
  description: string;
};

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
      <p className="mt-3 text-lg text-[#6c7aa5]">{description}</p>
    </div>
  );
}

type TermsSectionsProps = {
  sections: Array<{
    title: string;
    content: string;
  }>;
};

function TermsSections({ sections }: TermsSectionsProps) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <TermsSection key={section.title} section={section} />
      ))}
    </div>
  );
}

type TermsSectionProps = {
  section: {
    title: string;
    content: string;
  };
};

function TermsSection({ section }: TermsSectionProps) {
  return (
    <article className="rounded-2xl border border-[#dbe5ff] bg-white p-6">
      <h3 className="mb-3 text-xl font-semibold text-[#001d45]">
        {section.title}
      </h3>
      <p className="leading-relaxed text-[#4a5b82]">{section.content}</p>
    </article>
  );
}

function LastUpdatedSection() {
  return (
    <div className="mt-12 rounded-2xl bg-[#eef2ff] p-6 text-center">
      <p className="text-sm text-[#6c7aa5]">
        Last updated: November 2025
      </p>
      <p className="mt-2 text-xs text-[#6c7aa5]">
        These terms may be updated periodically. Please check back for the
        latest version.
      </p>
    </div>
  );
}

