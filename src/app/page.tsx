import Hero from "@/components/sections/Hero";
import LiveStatus from "@/components/features/LiveStatus";
import TechStack from "@/components/sections/TechStack";
import GithubStats from "@/components/GithubStats";
import Contact from "@/components/sections/Contact";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import Timeline from "@/components/sections/Timeline";
import BlogPosts from "@/components/BlogPosts";
import Background from "@/components/Background";
import MusicPlayer from "@/components/features/MusicPlayer";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-20 relative">
      <Background />
      <Hero />
      <LiveStatus />
      <FeaturedProjects />
      <TechStack />
      <Timeline />
      <GithubStats />
      <BlogPosts />
      <Contact />
      <MusicPlayer />
    </div>
  );
}
