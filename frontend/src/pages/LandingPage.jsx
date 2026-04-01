import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaBrain,
  FaChartLine,
  FaCheckCircle,
  FaComments,
  FaCompass,
  FaFileAlt,
  FaLaptopCode,
  FaRobot,
  FaSearch,
  FaUpload,
  FaUserGraduate,
} from "react-icons/fa";

const trustMetrics = [
  { value: "30K+", label: "Resumes reviewed" },
  { value: "94%", label: "ATS readiness lift" },
  { value: "12 min", label: "Average setup time" },
  { value: "4.8/5", label: "Student satisfaction" },
];

const featureCards = [
  {
    title: "Career Recommendation Engine",
    description:
      "Receive role suggestions aligned to your profile, strengths, and real market demand.",
    icon: FaChartLine,
    tone: "bg-[#eef5fc] border-[#d6e4f2]",
    iconTone: "bg-[#dce9f7] text-[#155b9a]",
    delayClass: "reveal-delay-1",
  },
  {
    title: "Skill Gap Intelligence",
    description:
      "Understand what is missing for your target role and prioritize what to learn next.",
    icon: FaBrain,
    tone: "bg-[#f1f6fc] border-[#dbe6f2]",
    iconTone: "bg-[#dce9f7] text-[#155b9a]",
    delayClass: "reveal-delay-2",
  },
  {
    title: "AI Career Copilot",
    description:
      "Ask career questions, test interview ideas, and get practical answers any time.",
    icon: FaComments,
    tone: "bg-[#edf4fb] border-[#d5e2f0]",
    iconTone: "bg-[#dce9f7] text-[#155b9a]",
    delayClass: "reveal-delay-3",
  },
];

const workflowSteps = [
  {
    title: "Create Your Profile",
    description: "Set your interests, experience level, and preferred career direction.",
    icon: FaUserGraduate,
  },
  {
    title: "Upload Resume",
    description: "Submit your resume to evaluate ATS structure, keywords, and clarity.",
    icon: FaUpload,
  },
  {
    title: "Get AI Analysis",
    description: "Receive role matches, skill gap insights, and focused improvement tips.",
    icon: FaRobot,
  },
  {
    title: "Take Action",
    description: "Follow your plan and track progress toward stronger job-market readiness.",
    icon: FaCompass,
  },
];

const impactBullets = [
  "Resume feedback mapped to ATS signals and keyword intent",
  "Roadmaps built from your profile, not generic templates",
  "Continuous guidance from chatbot conversations and updates",
  "Clear next steps for internships, graduate roles, and placements",
];

const insightCards = [
  {
    title: "Weekly Momentum",
    value: "+27%",
    description: "Average improvement in interview callback confidence after guided actions.",
    icon: FaLaptopCode,
  },
  {
    title: "Priority Skills",
    value: "Top 5",
    description: "Most impactful skills highlighted for your target role in one view.",
    icon: FaBrain,
  },
  {
    title: "Role Alignment",
    value: "92%",
    description: "Career matches ranked by skill fit, demand trend, and profile relevance.",
    icon: FaCompass,
  },
];

const heroPhotos = {
  primary: {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
    alt: "University students discussing a career plan",
  },
  resumeReview: {
    src: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1000&q=80",
    alt: "Student reviewing resume notes on a laptop",
  },
  mentorship: {
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80",
    alt: "Mentor guiding students during a discussion",
  },
};

function LandingPage() {
  return (
    <div className="landing-shell">
      <Header />

      <main>
        <section className="landing-hero relative overflow-hidden py-12 sm:py-16 lg:py-20">
          <div className="landing-container grid items-center gap-10 xl:gap-16 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="reveal-rise">
              <span className="inline-flex items-center rounded-full border border-[#cddff1] bg-[#e9f2fb] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#155b9a]">
                AI Career Intelligence For Students
              </span>

              <h1 className="landing-display mt-6 max-w-3xl text-4xl leading-[1.05] text-slate-900 sm:text-5xl lg:text-6xl">
                Stop guessing your future.
                <span className="mt-2 block text-[#155b9a]">
                  Build a career path with proof.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Smart Career turns your resume, interests, and goals into a practical action map.
                Scan for ATS issues, uncover skill gaps, and get role-specific guidance in minutes.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/getstarted"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#155b9a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#124b80] sm:w-auto sm:text-base"
                >
                  Launch Your Career Map
                  <FaArrowRight className="text-xs sm:text-sm" />
                </Link>
                <a
                  href="#features"
                  className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:text-base"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="landing-surface rounded-2xl bg-[#eef6ff] p-4">
                  <p className="landing-display text-2xl font-bold text-slate-900">94%</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">ATS readiness lift</p>
                </div>

                <div className="landing-surface rounded-2xl bg-[#f2f7fd] p-4">
                  <p className="landing-display text-2xl font-bold text-slate-900">4x</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500 sm:text-sm">
                    <FaBolt className="text-[#155b9a]" />
                    Faster planning
                  </p>
                </div>

                <div className="landing-surface rounded-2xl bg-[#ecf4fb] p-4">
                  <p className="landing-display text-2xl font-bold text-slate-900">24/7</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">AI support access</p>
                </div>
              </div>
            </div>

            <div className="relative reveal-rise reveal-delay-1">
              <div className="landing-surface rounded-[30px] p-5 sm:p-6">
                <div className="grid gap-3">
                  <div className="overflow-hidden rounded-3xl border border-[#d7e4f2]">
                    <img
                      src={heroPhotos.primary.src}
                      alt={heroPhotos.primary.alt}
                      className="h-64 w-full object-cover sm:h-[20rem] lg:h-[22rem]"
                      loading="eager"
                      decoding="async"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-2xl border border-[#d7e4f2]">
                      <img
                        src={heroPhotos.resumeReview.src}
                        alt={heroPhotos.resumeReview.alt}
                        className="h-28 w-full object-cover sm:h-32"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-[#d7e4f2]">
                      <img
                        src={heroPhotos.mentorship.src}
                        alt={heroPhotos.mentorship.alt}
                        className="h-28 w-full object-cover sm:h-32"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#cfe0f3] bg-[#eef6ff] p-3 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#155b9a]">Career Match</p>
                    <p className="landing-display mt-1 text-3xl font-bold text-slate-900">92%</p>
                  </div>

                  <div className="rounded-2xl border border-[#d7e4f4] bg-[#f2f7fd] p-3 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#155b9a]">Skill Coverage</p>
                    <p className="landing-display mt-1 text-3xl font-bold text-slate-900">12/15</p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <span>Action Progress</span>
                    <span className="text-[#155b9a]">80%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[80%] rounded-full bg-[#155b9a]" />
                  </div>
                </div>
              </div>

              <div className="landing-surface absolute -bottom-8 left-4 hidden rounded-2xl px-4 py-3 shadow-xl sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Weekly Growth Plan</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">3 high-impact skills queued</p>
              </div>

              <div className="landing-surface absolute -right-4 -top-6 hidden rounded-2xl px-4 py-3 shadow-xl md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Resume Score</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FaFileAlt className="text-cyan-600" />
                  91 / 100
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <div className="landing-container">
            <div className="landing-surface reveal-rise reveal-delay-2 rounded-3xl px-6 py-7 sm:px-8">
              <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                Trusted By Students Building Competitive Profiles
              </p>

              <div className="mt-6 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                {trustMetrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="landing-display text-3xl font-bold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pb-20 lg:pb-24">
          <div className="landing-container">
            <div className="mb-10 max-w-3xl reveal-rise">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#155b9a]">Platform Features</span>
              <h2 className="landing-display mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                A complete career toolkit in one focused workspace
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Designed to remove noise and deliver clear decisions from resume optimization to
                guided role discovery.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <article className="landing-surface reveal-rise rounded-3xl bg-[#f7fbff] p-8 lg:col-span-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#155b9a]">Core Feature</p>
                    <h3 className="landing-display mt-2 text-3xl font-bold text-slate-900">ATS Resume Scanner</h3>
                  </div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dce9f7] text-2xl text-[#155b9a]">
                    <FaSearch />
                  </span>
                </div>

                <p className="mt-5 max-w-2xl text-slate-600">
                  Detect formatting weaknesses, missing role keywords, and readability issues that
                  can block your resume before a recruiter reads it.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#cfe0f3] bg-[#eef6ff] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Keyword Match</p>
                    <p className="landing-display mt-1 text-2xl font-bold text-slate-900">89%</p>
                  </div>
                  <div className="rounded-2xl border border-[#d7e4f4] bg-[#f2f7fd] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Format Score</p>
                    <p className="landing-display mt-1 text-2xl font-bold text-slate-900">93%</p>
                  </div>
                  <div className="rounded-2xl border border-[#dbe5f2] bg-[#f5f8fc] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Action Tips</p>
                    <p className="landing-display mt-1 text-2xl font-bold text-slate-900">12</p>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl bg-[#f3f7fc] px-4 py-3 text-sm font-medium text-slate-700">
                    <FaCheckCircle className="text-[#155b9a]" />
                    ATS-safe section structure
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f3f7fc] px-4 py-3 text-sm font-medium text-slate-700">
                    <FaCheckCircle className="text-[#155b9a]" />
                    Job-specific keyword guidance
                  </div>
                </div>
              </article>

              <div className="grid gap-6 lg:col-span-5">
                {featureCards.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className={`landing-surface reveal-rise ${feature.delayClass} rounded-3xl p-6 ${feature.tone}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="landing-display text-2xl font-bold text-slate-900">{feature.title}</h3>
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${feature.iconTone}`}>
                          <Icon />
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="pb-20 lg:pb-24">
          <div className="landing-container">
            <div className="mb-10 max-w-3xl reveal-rise">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#155b9a]">How It Works</span>
              <h2 className="landing-display mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
                Four simple steps to career clarity
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Every stage is structured to reduce confusion and move you toward confident job
                applications.
              </p>
            </div>

            <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-[#d8e3f0] xl:block" />

              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.title} className="landing-surface reveal-rise rounded-3xl p-6">
                    <div className="relative mb-5 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#155b9a] text-lg text-white">
                        <Icon />
                      </span>
                      <span className="landing-display text-3xl font-bold text-slate-200">0{index + 1}</span>
                    </div>
                    <h3 className="landing-display text-2xl font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="outcomes" className="pb-20 lg:pb-24">
          <div className="landing-container grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="reveal-rise rounded-3xl bg-[#0f243d] p-8 text-slate-100 shadow-xl sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ec8f0]">What You Get</span>
              <h2 className="landing-display mt-3 text-3xl font-bold text-white sm:text-4xl">
                Data-backed direction, not random career advice
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Smart Career connects analysis, recommendations, and action so you can make stronger
                decisions with confidence.
              </p>

              <ul className="mt-8 space-y-4">
                {impactBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-[#9ec8f0]" />
                    <span className="text-sm leading-relaxed text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/getstarted"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#e9f3ff]"
              >
                Start Building Your Plan
                <FaArrowRight className="text-xs" />
              </Link>
            </article>

            <div className="grid gap-5">
              {insightCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className={`landing-surface reveal-rise ${index === 0 ? "reveal-delay-1" : index === 1 ? "reveal-delay-2" : "reveal-delay-3"} rounded-3xl p-6`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{card.title}</p>
                        <p className="landing-display mt-2 text-4xl font-bold text-slate-900">{card.value}</p>
                      </div>
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#dce9f7] text-xl text-[#155b9a]">
                        <Icon />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pb-20 pt-4 lg:pb-24">
          <div className="landing-container">
            <div className="reveal-rise rounded-[34px] bg-[#155b9a] px-8 py-14 text-center text-white shadow-xl sm:px-12">
              <h2 className="landing-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                Ready to turn career confusion into momentum?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-100 sm:text-lg">
                Join students who are using structured AI guidance to improve resumes, skills, and
                role-fit decisions faster.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/getstarted"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:text-base"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl border border-white bg-[#155b9a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#124b80] sm:text-base"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
