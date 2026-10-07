import { ComeFunziona } from "@/components/home/ComeFunziona";
import { EventiPreview } from "@/components/home/EventiPreview";
import { Hero } from "@/components/home/Hero";
import { InfoStrip } from "@/components/home/InfoStrip";
import { Locale } from "@/components/home/Locale";
import { Orari } from "@/components/home/Orari";
import { Storefront } from "@/components/home/Storefront";
import { Marquee } from "@/components/motion/Marquee";

const marquee = ["Esco brillo", "Esco & brillo", "Esco di casa", "E vado da Esco®", "It’s all about music"];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={marquee} />
      <InfoStrip />
      <Locale />
      <Orari />
      <ComeFunziona />
      <EventiPreview />
      <Storefront />
    </>
  );
}
