import React from "react";
import Header from "../../components/home-template/Header";
import Hero from "../../components/home-template/Hero";
import AboutSection from "../../components/home-template/AboutSection";
import BlogSection from "../blogs/BlogSection";
import EventsSection from "../../components/home-template/EventsSection";
import TestimonialsSection from "../../components/home-template/TestimonialsSection";
import FAQSection from "../../components/home-template/FAQSection";
import Footer from "../../components/home-template/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      {/* <BlogSection/> */}
      {/* <EventsSection /> */}
      <TestimonialsSection />
      {/* <BlogSection /> */}
      <FAQSection />
      <Footer />
    </div>
  );
};

export default HomePage;
