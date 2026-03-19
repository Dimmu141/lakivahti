import type { Metadata } from "next";
import Header from "@/components/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tietosuoja — Lakivahti",
  description: "Lakivahdin tietosuojaseloste",
};

export default function TietosuojaPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1
          className="text-2xl font-bold tracking-tight mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Tietosuoja
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Päivitetty: 19.3.2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Palvelu
            </h2>
            <p>
              Lakivahti on yksityishenkilön ylläpitämä prototyyppipalvelu, joka seuraa Suomen
              eduskunnan lakihankkeiden etenemistä. Palvelu ei ole virallinen Eduskunnan tai
              minkään viranomaisen palvelu.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Kerätyt tiedot
            </h2>
            <p>
              Lakivahti <strong>ei kerää, tallenna eikä käsittele</strong> käyttäjien
              henkilötietoja. Palvelu ei käytä evästeitä, rekisteröitymistä tai
              käyttäjäseurantaa.
            </p>
            <p className="mt-2">
              Palvelin saattaa tallentaa tavanomaisia HTTP-pyyntölokeja (IP-osoite,
              aikaleima, pyydetty sivu) lyhytaikaisesti teknistä ylläpitoa varten.
              Nämä tiedot poistetaan automaattisesti eikä niitä luovuteta kolmansille
              osapuolille.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Lähdedata
            </h2>
            <p>
              Palvelussa esitettävä lakihanketieto on peräisin{" "}
              <a
                href="https://avoindata.eduskunta.fi"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent-green)" }}
              >
                Eduskunnan avoimesta datasta
              </a>{" "}
              (CC BY 4.0). Kansanedustajatiedot ja äänestystulokset ovat julkista tietoa.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Kolmannen osapuolen palvelut
            </h2>
            <p>
              Palvelu on käytössä Vercelin infrastruktuurissa (Yhdysvallat). Vercel voi
              kerätä teknisiä lokeja palvelun toiminnan valvomiseksi. Katso{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent-green)" }}
              >
                Vercelin tietosuojaseloste
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Yhteydenotot
            </h2>
            <p>
              Tietosuojaan liittyvissä kysymyksissä voi ottaa yhteyttä GitHub-projektin
              kautta.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="text-sm hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            ← Takaisin etusivulle
          </Link>
        </div>
      </main>
    </>
  );
}
