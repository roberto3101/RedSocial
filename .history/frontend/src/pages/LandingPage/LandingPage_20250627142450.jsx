// src/pages/LandingPage/LandingPage.jsx
import Hero from "./LandingComponents/Hero";
import FeaturedProfiles from "./LandingComponents/FeaturedProfiles";

export default function LandingPage() {
  return (
    <div className="landing-root">
      <Hero />
      <FeaturedProfiles />
    </div>
  );
}