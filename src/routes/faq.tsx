import { createFileRoute } from "@tanstack/react-router";
import { ProductNav } from "@/components/desire/ProductNav";
import { PdpMarquee } from "@/components/desire/PdpMarquee";
import { Footer } from "@/components/desire/Footer";
import { FAQ } from "@/components/desire/FAQ";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ, DESIRE" },
      { name: "description", content: "Frequently asked questions about DESIRE." },
    ],
  }),
});

function FAQPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PdpMarquee />
      <ProductNav />
      <main>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
