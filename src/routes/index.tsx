import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/desire/AnnouncementBar";
import { Nav } from "@/components/desire/Nav";
import { Hero } from "@/components/desire/Hero";
import { Press } from "@/components/desire/Press";
import { UsersBand } from "@/components/desire/UsersBand";

import { PainPointsMarquee } from "@/components/desire/PainPointsMarquee";
import { StatsGrid } from "@/components/desire/StatsGrid";
import { Testimonials } from "@/components/desire/Testimonials";

import { Ingredients } from "@/components/desire/Ingredients";


import { Guarantee } from "@/components/desire/Guarantee";
import { FAQ } from "@/components/desire/FAQ";
import { Footer } from "@/components/desire/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <div data-track-section="Hero"><Hero /></div>
        <div data-track-section="Users Band"><UsersBand /></div>
        <div data-track-section="Pain Points"><PainPointsMarquee /></div>
        <div data-track-section="Press"><Press /></div>
        <div data-track-section="Stats"><StatsGrid /></div>
        <div data-track-section="Testimonials"><Testimonials /></div>
        <div data-track-section="Ingredients"><Ingredients /></div>
        <div data-track-section="Guarantee"><Guarantee /></div>
        <div data-track-section="FAQ"><FAQ /></div>
      </main>
      <Footer />
    </>
  );
}
