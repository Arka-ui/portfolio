import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import TechStack from "@/components/sections/TechStack";
import Timeline from "@/components/sections/Timeline";
import LiveStatus from "@/components/features/LiveStatus";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="flex flex-col pb-0 relative">
      <Hero />
      <About />
      <FeaturedProjects />
      <TechStack />
      <Timeline />
      <LiveStatus />
      <Contact />
    </div>
  );
}
