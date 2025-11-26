import Footer from "@/components/footer";
import {
  FaPlane,
  FaClipboardList,
  FaTicket,
  FaSuitcase,
  FaSignal,
  FaCreditCard,
} from "react-icons/fa6";

const helpTopics = [
  {
    title: "Booking a Flight",
    description:
      "Learn how to search, select, and book flights through our platform.",
    icon: FaPlane,
  },
  {
    title: "Managing Your Booking",
    description:
      "Change or cancel your booking, select seats, and update passenger information.",
    icon: FaClipboardList,
  },
  {
    title: "Check-in Process",
    description:
      "Complete online check-in, print boarding passes, and prepare for your flight.",
    icon: FaTicket,
  },
  {
    title: "Baggage Information",
    description:
      "Understand baggage allowances, restrictions, and special items policies.",
    icon: FaSuitcase,
  },
  {
    title: "Flight Status",
    description:
      "Track your flight status, delays, and get real-time updates.",
    icon: FaSignal,
  },
  {
    title: "Payment & Refunds",
    description:
      "Information about payment methods, refund policies, and processing times.",
    icon: FaCreditCard,
  },
];

export default function HelpCenterPage() {
  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <PageHeader
            title="Help Center"
            description="Find answers and guidance for all your travel needs"
          />
          <HelpTopicsGrid topics={helpTopics} />
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

type HelpTopicsGridProps = {
  topics: Array<{
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
};

function HelpTopicsGrid({ topics }: HelpTopicsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {topics.map((topic) => (
        <HelpTopicCard key={topic.title} topic={topic} />
      ))}
    </div>
  );
}

type HelpTopicCardProps = {
  topic: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  };
};

function HelpTopicCard({ topic }: HelpTopicCardProps) {
  const Icon = topic.icon;
  return (
    <article className="rounded-2xl border border-[#dbe5ff] bg-white p-6 transition hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#acd6ff] text-[#0047ab]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{topic.title}</h3>
      <p className="text-sm leading-relaxed text-[#4a5b82]">
        {topic.description}
      </p>
    </article>
  );
}

