import Image from "next/image";
import { Registered } from "@/components/ui/Tag";
import vetrina from "@/assets/images/vetrina.jpg";
import styles from "./home.module.css";

export function Storefront() {
  return (
    <section aria-label="Vieni a trovarci" className={`${styles.storefront} theme-night`}>
      <Image src={vetrina} alt="La vetrina di ESCO con la panca in alluminio" fill placeholder="blur" sizes="100vw" />
      <p className={`${styles.sloganBox} t-title`}>
        E vado da Esco
        <Registered />
      </p>
    </section>
  );
}
