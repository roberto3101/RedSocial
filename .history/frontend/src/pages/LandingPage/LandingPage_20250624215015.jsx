import "./landing.css";
import Hero from "../landingComponents/Hero";
import FeaturedProfiles from "../landingComponents/FeaturedProfiles";
import Features from "../landingComponents/Features";
import HowItWorks from "../landingComponents/HowItWorks";
import Testimonials from "../landingComponents/Testimonials";
import CallToAction from "../landingComponents/CallToAction";
import FAQ from "./landingComponents/FAQ";
import Footer from "./landingComponents/Footer";

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Hero />
      <FeaturedProfiles />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <FAQ />
      <Footer />
    </div>
  );
}
