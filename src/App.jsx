import React from "react";
import ReactLenis from "lenis/react";

import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ReviewSummary from "./sections/ReviewSummary";
import Services from "./sections/Services";
import About from "./sections/About";
import Works from "./sections/Works";
import ContactSummary from "./sections/ContactSummary";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      <Navbar />
      <Hero />
      <ReviewSummary />
      <Services />
      <About />
      <Works />
      <ContactSummary />
      <Contact />
    </ReactLenis>
  );
}
