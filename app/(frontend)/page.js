"use client";
import { useEffect, useState } from "react";
import CustomCursor from "@/Components/CustomCursor/CustomCursor";
import Hero from "@/Components/Hero/Hero";
import Services from "@/Components/Services/Services";
import CaseStudies from "@/Components/CaseStudies/CaseStudies";
import Review from "@/Components/Review/Review";
import Faq from "@/Components/Faq/Faq";
import Parteners from "@/Components/Parteners/Parteners";
import Pricing from "@/Components/Priceing/Priceing";
import Contact from "@/Components/Contact/Contact";
import Loader from "./loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time (e.g., 2.5 seconds)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Or wait for actual condition
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <CustomCursor />
      {isLoading ? (
        <Loader />
      ) : (
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main>
              <Hero />
              <Parteners />
              <Services />
              <CaseStudies />
              <Review />
              <Pricing />
              <Faq />
              <Contact />
            </main>
          </div>
        </div>
      )}
    </>
  );
}
