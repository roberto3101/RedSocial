// src/pages/LandingPage/LandingPage.jsx
import Hero from "./LandingComponents/Hero";
import FeaturedProfiles from "./LandingComponents/FeaturedProfiles";
import Features from "./LandingComponents/Features";
import Footer from "./LandingComponents/Footer";
export default function LandingPage() {
  return (
    <div className="landing-root">
      <Hero />
      <FeaturedProfiles />
      <Features />
      <Footer />
    </div>
  );
}