/* eslint-disable @next/next/no-img-element */
// Trigger Vercel deployment

import Footer from "@/components/footer";

const featuredArticle = {
  date: "November 15, 2025",
  headline: "Omnira Airlines Expands Fleet with 15 New Aircraft to Enhance Regional Connectivity",
  summary:
    "Omnira Airlines announces a major expansion initiative, adding 15 new aircraft to its fleet to improve regional connectivity and reduce travel times across Southeast Asia.",
  image: "/img/background.svg",
  badge: "FLEET EXPANSION",
  partners: {
    ledBy: "BOEING",
    alongside: ["AIRBUS", "EMBRAER", "BOMBARDIER"],
  },
};

const recentArticles = [
  {
    date: "November 10, 2025",
    headline: "New Direct Routes to Tokyo and Seoul Now Available",
    summary:
      "Travelers can now enjoy direct flights to Tokyo and Seoul, reducing travel time and offering more convenient connections.",
  },
  {
    date: "November 5, 2025",
    headline: "Enhanced Safety Measures Implemented Across All Flights",
    summary:
      "Omnira Airlines introduces advanced safety protocols and upgraded aircraft maintenance procedures to ensure passenger security.",
  },
  {
    date: "October 28, 2025",
    headline: "Winter Sale: Up to 40% Off on International Flights",
    summary:
      "Book your winter getaway with our special promotion offering significant discounts on selected international destinations.",
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="min-h-screen bg-white px-8 py-16 text-[#001d45] md:px-16">
        <div className="mx-auto max-w-7xl">
          <BlogNavigation />
          <BlogHeader />
          <FeaturedArticleSection article={featuredArticle} />
          <RecentArticlesSection articles={recentArticles} />
        </div>
      </div>
      <Footer />
    </>
  );
}

function BlogNavigation() {
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

function BlogHeader() {
  return (
    <div className="mb-16 text-center">
      <h1 className="text-4xl font-semibold md:text-5xl">Blog & Resources</h1>
      <p className="mt-3 text-lg text-[#6c7aa5]">
        Find the latest content, insights, and resources from Omnira here.
      </p>
    </div>
  );
}

type FeaturedArticleProps = {
  article: {
    date: string;
    headline: string;
    summary: string;
    image: string;
    badge: string;
    partners: {
      ledBy: string;
      alongside: string[];
    };
  };
};

function FeaturedArticleSection({ article }: FeaturedArticleProps) {
  return (
    <section className="mb-20 grid gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
      <FeaturedCard article={article} />
      <ArticleDetails article={article} />
    </section>
  );
}

function FeaturedCard({ article }: FeaturedArticleProps) {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${article.image})`,
          filter: "brightness(0.4)",
        }}
      />
      <div className="relative flex h-full flex-col justify-between p-8 text-white">
        <div className="flex items-center gap-3">
          <img
            src="/airline-logo.svg"
            alt="Omnira Airlines"
            className="h-8 w-auto"
          />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-7xl font-bold md:text-8xl">15</div>
            <div className="mt-2 text-xl font-semibold">NEW AIRCRAFT</div>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#001d45] transition hover:bg-white/90">
            {article.badge}
          </button>

          <div className="rounded-2xl bg-[#0047ab]/90 px-6 py-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Led by
              </span>
              <span className="text-sm font-bold">{article.partners.ledBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Alongside
              </span>
              <div className="flex gap-2 text-xs font-semibold">
                {article.partners.alongside.map((partner, idx) => (
                  <span key={partner}>
                    {partner}
                    {idx < article.partners.alongside.length - 1 && ","}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleDetails({ article }: FeaturedArticleProps) {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <p className="text-sm font-semibold text-[#6c7aa5]">{article.date}</p>
      <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
        {article.headline}
      </h2>
      <p className="text-lg leading-relaxed text-[#4a5b82]">
        {article.summary}
      </p>
      <a
        href="#"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0047ab] transition hover:text-[#1d5ed6]"
      >
        Read more
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-current"
        >
          <path
            d="M5 12h14m0 0-5-5m5 5-5 5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

type RecentArticlesSectionProps = {
  articles: Array<{
    date: string;
    headline: string;
    summary: string;
  }>;
};

function RecentArticlesSection({ articles }: RecentArticlesSectionProps) {
  return (
    <section>
      <h2 className="mb-8 text-2xl font-semibold">Recent Articles</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}
      </div>
    </section>
  );
}

type ArticleCardProps = {
  article: {
    date: string;
    headline: string;
    summary: string;
  };
};

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="rounded-2xl border border-[#dbe5ff] bg-white p-6 transition hover:shadow-lg">
      <p className="mb-3 text-xs font-semibold text-[#6c7aa5]">{article.date}</p>
      <h3 className="mb-3 text-lg font-semibold leading-tight">
        {article.headline}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-[#4a5b82]">
        {article.summary}
      </p>
      <a
        href="#"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0047ab] transition hover:text-[#1d5ed6]"
      >
        Read more
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-current"
        >
          <path
            d="M5 12h14m0 0-5-5m5 5-5 5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </article>
  );
}

