import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <>
      <PageHero title="Lato C">Questa pagina non esiste. Il disco gira altrove.</PageHero>
      <section className="theme-paper" style={{ padding: "64px var(--gutter) 120px" }}>
        <div style={{ maxWidth: "var(--content-max)", margin: "0 auto" }}>
          <ButtonLink href="/">Torna alla home</ButtonLink>
        </div>
      </section>
    </>
  );
}
