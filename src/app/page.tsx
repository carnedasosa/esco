import { ComeFunziona } from "@/components/home/ComeFunziona";
import { EventiPreview } from "@/components/home/EventiPreview";
import { Hero } from "@/components/home/Hero";
import { InfoStrip } from "@/components/home/InfoStrip";
import { Locale } from "@/components/home/Locale";
import { Orari } from "@/components/home/Orari";
import { Storefront } from "@/components/home/Storefront";

export default function HomePage() {
  return (
    <>
      <Hero />
      <InfoStrip />
      <Locale />
      <Orari />
      <ComeFunziona />
      <EventiPreview />
      <Storefront />
    </>
  );
}
