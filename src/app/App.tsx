import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Features } from "./components/Features";
import { Benefits } from "./components/Benefits";
import { Mission } from "./components/Mission";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Features />
      <Benefits />
      <Mission />
      <CTA />
      <Footer />
    </div>
  );
}