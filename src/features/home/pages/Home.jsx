import AppLayout from "@/app/layouts/AppLayout";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import WorkflowJourney from "../components/WorkflowJourney";
import Footer from "../components/Footer";
import GithubSocials from "../components/GithubSocials";
import Hero from "../components/Hero";

/* ------------------------------------------------------------------ */
/*  HOME COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const Home = () => {
  return (
    <AppLayout>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:gap-6 md:py-8">
        {/* ── NAVBAR ───────────────────────────────────────────────── */}
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <Hero />

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <Features />

        {/* ── WORKFLOW JOURNEY ──────────────────────────────────────── */}
        <WorkflowJourney />

        {/* ── GITHUB & SOCIALS ──────────────────────────────────────── */}
        <GithubSocials />

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <Footer />
      </div>
    </AppLayout>
  );
};

export default Home;
