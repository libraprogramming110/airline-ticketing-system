/* eslint-disable @next/next/no-img-element */

const contactOptions = [
  { label: "Personal Information", active: true },
  { label: "Change Password", active: false },
  { label: "Delete Account", active: false },
];

export default function AdminProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#0b1324] text-[#001d45]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#f5f7fb]">
        <Header />
        <section className="px-8 pb-16 pt-8">
          <ProfileContent />
        </section>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col gap-8 border-r border-white/10 bg-gradient-to-b from-[#081024] to-[#02050e] px-6 py-10 text-white">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold">
          JC
        </div>
        <p className="mt-4 text-base font-semibold">John Carlo Cruz</p>
        <p className="text-sm text-white/60">@johncarlocruz</p>
      </div>

      <nav className="flex flex-1 flex-col gap-4 text-sm font-semibold">
        {["Home", "Bookings", "Flights", "Reports", "Profile", "Log out"].map((item) => (
          <a
            key={item}
            href={item === "Home" ? "/admin" : item === "Profile" ? "/admin/profile" : "#"}
            className={`rounded-md px-3 py-2 transition hover:bg-white/10 ${item === "Profile" ? "bg-white/10" : ""}`}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="border-b border-[#dbe5ff] bg-white px-8 py-4 shadow-sm">
      <img src="/airline-logo2.svg" alt="Omnira Administration" className="h-14 w-auto" />
    </header>
  );
}

function ProfileContent() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(320px,0.85fr)_minmax(480px,1.15fr)]">
      <ProfileCard />
      <PersonalInformationForm />
    </section>
  );
}

function ProfileCard() {
  return (
    <article className="rounded-3xl bg-white p-6 text-center shadow-sm">
      <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-md">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile placeholder"
          className="h-full w-full object-cover"
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[#001d45]">John Carlo Cruz</h2>
      <p className="text-sm text-[#6c7aa5]">Customer Service Lead</p>
      <div className="mt-6 space-y-3">
        {contactOptions.map((option) => (
          <button
            key={option.label}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold ${
              option.active ? "bg-[#0b5ed7] text-white" : "bg-[#eef2ff] text-[#001d45]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </article>
  );
}

const personalFields = [
  { label: "First Name", value: "John Carlo" },
  { label: "Last Name", value: "Cruz" },
  { label: "Email", value: "Enter your email" },
  { label: "Phone Number", value: "+63" },
  { label: "Address", value: "Enter your address" },
  { label: "City", value: "" },
  { label: "Province", value: "" },
  { label: "Date of Birth", value: "December 15, 2000" },
  { label: "Sex", value: "Male" },
];

function PersonalInformationForm() {
  return (
    <article className="flex flex-col rounded-3xl bg-white shadow-sm">
      <header className="rounded-t-3xl bg-[#0b5ed7] px-6 py-4 text-white">
        <h2 className="text-lg font-semibold">Personal Information</h2>
      </header>
      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          {personalFields.map((field) => (
            <label key={field.label} className="space-y-2 text-sm">
              <span className="text-[#6c7aa5]">{field.label}</span>
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-full rounded-lg border border-[#dbe5ff] bg-white px-4 py-2 text-sm text-[#001d45] placeholder:text-[#9aa6c1]"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-center">
          <button className="w-full max-w-xs rounded-lg bg-[#0b5ed7] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#094fb4]">
            Edit Personal Information
          </button>
        </div>
      </div>
    </article>
  );
}


