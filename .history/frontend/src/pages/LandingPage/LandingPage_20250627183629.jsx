// src/pages/LandingPage/LandingPage.jsx
import Hero from "./LandingComponents/Hero";
import FeaturedProfiles from "./LandingComponents/FeaturedProfiles";
impofrt Features from "./LandingComponents/Features";
export default function LandingPage() {
  return (
    <div className="landing-root">
      <Hero />
      <FeaturedProfiles />
      <Features />
    </div>
  );
}