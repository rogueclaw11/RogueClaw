import HeroSection from "./components/HeroSection";
import MarqueeTicker from "./components/MarqueeTicker";
import AgentsSection from "./components/AgentsSection";
import LiveFeed from "./components/LiveFeed";
import ConflictVisualizer from "./components/ConflictVisualizer";
import HowItWorks from "./components/HowItWorks";
import BuildersSection from "./components/BuildersSection";
import TokenomicsSection from "./components/TokenomicsSection";
import RoadmapSection from "./components/RoadmapSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeTicker />
      <AgentsSection />
      <LiveFeed />
      <ConflictVisualizer />
      <HowItWorks />
      <BuildersSection />
      <TokenomicsSection />
      <RoadmapSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
