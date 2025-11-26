import Footer from "@/components/footer";

const faqs = [
  {
    question: "How do I book a flight?",
    answer:
      "You can book a flight by searching for your desired origin, destination, and travel dates on our homepage. Select your preferred flight, choose your seats, and complete the booking process with passenger information and payment.",
  },
  {
    question: "Can I change or cancel my booking?",
    answer:
      "Yes, you can manage your booking through the 'Manage Booking' section. Changes and cancellations are subject to fare rules and may incur fees. Please review your booking details for specific terms.",
  },
  {
    question: "What is the baggage allowance?",
    answer:
      "Baggage allowances vary by fare type and route. Economy class typically includes one carry-on bag (7kg) and one checked bag (20kg). Please check your booking confirmation for specific allowances.",
  },
  {
    question: "How do I check in online?",
    answer:
      "Online check-in opens 24 hours before your flight departure. Visit the 'Check-in' section, enter your booking reference and last name, then follow the prompts to complete check-in and receive your boarding pass.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, Mastercard, American Express), debit cards, and various digital payment methods. All transactions are secure and encrypted.",
  },
  {
    question: "How long does it take to process a refund?",
    answer:
      "Refund processing typically takes 7-14 business days after approval. The refund will be credited back to the original payment method used for the booking.",
  },
  {
    question: "Can I select my seat in advance?",
    answer:
      "Yes, seat selection is available during the booking process or through the 'Manage Booking' section. Some seats may have additional fees depending on the seat type and fare class.",
  },
  {
    question: "What should I do if my flight is delayed?",
    answer:
      "If your flight is delayed, we will notify you via email or SMS. You can also check real-time flight status on our website. For significant delays, we will assist with rebooking or accommodation as needed.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-4xl">
          <BackNavigation />
          <PageHeader
            title="Frequently Asked Questions"
            description="Find quick answers to common questions about our services"
          />
          <FAQsList faqs={faqs} />
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

type FAQsListProps = {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

function FAQsList({ faqs }: FAQsListProps) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, idx) => (
        <FAQItem key={idx} faq={faq} />
      ))}
    </div>
  );
}

type FAQItemProps = {
  faq: {
    question: string;
    answer: string;
  };
};

function FAQItem({ faq }: FAQItemProps) {
  return (
    <article className="rounded-2xl border border-[#dbe5ff] bg-white p-6">
      <h3 className="mb-3 text-lg font-semibold text-[#001d45]">
        {faq.question}
      </h3>
      <p className="leading-relaxed text-[#4a5b82]">{faq.answer}</p>
    </article>
  );
}

