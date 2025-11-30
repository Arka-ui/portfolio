import Hero from "@/components/Hero";
import LiveStatus from "@/components/LiveStatus";
import TechStack from "@/components/TechStack";
import GithubStats from "@/components/GithubStats";
import Contact from "@/components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import Timeline from "@/components/Timeline";
import BlogPosts from "@/components/BlogPosts";
import Background from "@/components/Background";
import MusicPlayer from "@/components/MusicPlayer";

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
