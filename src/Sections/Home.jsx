// Sections/Home.jsx
import React from "react";
import "../index.css";
import Contact from "../components/Contact";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PostSection from "../components/PostSection";
import About from "../components/About";
import Footer from "../components/Footer";
import CustomCursor from "../components/CustomCursor";
import CaveLink from "../components/CaveLink";
import "../components/EditPostModal"
import EditPostModal from "../components/EditPostModal";
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <PostSection />
      <About />
      <Contact />
      <Footer />
      <CustomCursor />
      <CaveLink />
      <EditPostModal />
    </>
  );
}

export default Home;
