import Footer from "@/components/footer";
import { FaPhone, FaEnvelope, FaLocationDot } from "react-icons/fa6";

const contactMethods = [
  {
    title: "Phone",
    value: "+63 9123 456 7890",
    description: "Available 24/7 for urgent matters",
    icon: FaPhone,
  },
  {
    title: "Email",
    value: "info@omniraairlines.com",
    description: "We respond within 24 hours",
    icon: FaEnvelope,
  },
  {
    title: "Address",
    value: "1234 Airport Blvd",
    description: "Cagayan de Oro Laguindingan Airport",
    icon: FaLocationDot,
  },
];

const businessHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
];

export default function ContactUsPage() {
  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <PageHeader
            title="Contact Us"
            description="Get in touch with our customer support team"
          />
          <ContactMethodsGrid methods={contactMethods} />
          <BusinessHoursSection hours={businessHours} />
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

type ContactMethodsGridProps = {
  methods: Array<{
    title: string;
    value: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
};

function ContactMethodsGrid({ methods }: ContactMethodsGridProps) {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-3">
      {methods.map((method) => (
        <ContactMethodCard key={method.title} method={method} />
      ))}
    </div>
  );
}

type ContactMethodCardProps = {
  method: {
    title: string;
    value: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  };
};

function ContactMethodCard({ method }: ContactMethodCardProps) {
  const Icon = method.icon;
  return (
    <article className="rounded-2xl border border-[#dbe5ff] bg-white p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#acd6ff] text-[#0047ab]">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{method.title}</h3>
      <p className="mb-2 text-sm font-semibold text-[#0047ab]">
        {method.value}
      </p>
      <p className="text-xs text-[#6c7aa5]">{method.description}</p>
    </article>
  );
}

type BusinessHoursSectionProps = {
  hours: Array<{
    day: string;
    hours: string;
  }>;
};

function BusinessHoursSection({ hours }: BusinessHoursSectionProps) {
  return (
    <section className="rounded-2xl border border-[#dbe5ff] bg-white p-6">
      <h2 className="mb-6 text-2xl font-semibold">Business Hours</h2>
      <div className="space-y-3">
        {hours.map((schedule) => (
          <div
            key={schedule.day}
            className="flex items-center justify-between border-b border-[#dbe5ff] pb-3 last:border-0"
          >
            <span className="font-semibold text-[#001d45]">
              {schedule.day}
            </span>
            <span className="text-[#4a5b82]">{schedule.hours}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

