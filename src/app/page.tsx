"use client";

import HeroSection from "@/components/landing-page/hero-section";
import FAQSection from "@/components/landing-page/faq-section";
import ContactSection from "@/components/landing-page/contact-section";
// import { ThemeToggle } from "@/components/darktheme/darktheme";

export default function Home() {

  return (
    <>
      {/* <ThemeToggle /> */}
      <HeroSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
