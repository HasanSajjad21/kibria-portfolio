import { Achievements } from '@/components/achievements/Achievements';
import { Capabilities } from '@/components/capabilities/Capabilities';
import { Contact } from '@/components/contact/Contact';
import { EngineeringStories } from '@/components/engineering-stories/EngineeringStories';
import { Experience } from '@/components/experience/Experience';
import { Footer } from '@/components/footer/Footer';
import { Hero } from '@/components/hero/Hero';
import { RailNav } from '@/components/nav/RailNav';
import { ReplayButton } from '@/components/nav/ReplayButton';
import { ReplayProvider } from '@/components/providers/ReplayProvider';
import { SelectedWork } from '@/components/selected-work/SelectedWork';
import { showReplayButton } from '@/data/site';

export default function HomePage() {
  return (
    <ReplayProvider>
      <main className="page">
        <Hero />
        <Experience />
        <SelectedWork />
        <Capabilities />
        <EngineeringStories />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <RailNav />
      {showReplayButton && <ReplayButton />}
    </ReplayProvider>
  );
}
