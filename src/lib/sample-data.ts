export interface SampleExpert {
  id: number;
  expertName: string;
  expertOrganization: string | null;
  hearingDate: string | null;
  committeeCode: string | null;
  position: string | null;
  summaryFi: string | null;
  documentUrl: string | null;
}

export interface SampleCommittee {
  committeeCode: string;
  committeeNameFi: string;
  role: "lead" | "statement";
  reportId: string | null;
  reportDate: string | null;
}

export interface SampleMpVote {
  mpName: string;
  party: string;
  voteValue: "Jaa" | "Ei" | "Poissa" | "Tyhjää";
}

export interface SampleVote {
  id: string;
  voteDate: string;
  votesFor: number;
  votesAgainst: number;
  votesAbsent: number;
  votesEmpty: number;
  result: "passed" | "rejected";
  mpVotes: SampleMpVote[];
}

export interface SampleDocument {
  id: string;
  docType: string;
  titleFi: string;
  publishedDate: string;
  eduskuntaUrl: string;
}

export interface SampleBill {
  id: string;
  billType: string;
  billNumber: number;
  billYear: number;
  titleFi: string;
  summaryFi: string;
  category: string;
  currentStage: string;
  submittedDate: string;
  stageUpdatedAt: string;
  sponsor: string;
  urgency: "high" | "normal" | "low";
  keywords: string[];
  eduskuntaUrl: string;
  committees: SampleCommittee[];
  experts: SampleExpert[];
  votes: SampleVote[];
  documents: SampleDocument[];
}

export const SAMPLE_BILLS: SampleBill[] = [
  {
    id: "HE 12/2026 vp",
    billType: "HE",
    billNumber: 12,
    billYear: 2026,
    titleFi: "Hallituksen esitys eduskunnalle laiksi asevelvollisuuslain muuttamisesta",
    summaryFi:
      "Esityksessä ehdotetaan asevelvollisuuslakia muutettavaksi siten, että kertausharjoitusten enimmäispituutta pidennetään ja reservin koulutusta tehostetaan. Muutoksilla pyritään vahvistamaan Suomen puolustuskykyä.",
    category: "Puolustus",
    currentStage: "voted",
    submittedDate: "2026-01-20",
    stageUpdatedAt: "2026-03-10",
    sponsor: "Valtioneuvosto",
    urgency: "high",
    keywords: ["asevelvollisuus", "maanpuolustus", "reservi", "kertausharjoitus"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_12+2026.aspx",
    committees: [
      {
        committeeCode: "PuV",
        committeeNameFi: "Puolustusvaliokunta",
        role: "lead",
        reportId: "PuVM 2/2026 vp",
        reportDate: "2026-02-28",
      },
      {
        committeeCode: "PeV",
        committeeNameFi: "Perustuslakivaliokunta",
        role: "statement",
        reportId: "PeVL 5/2026 vp",
        reportDate: "2026-02-20",
      },
    ],
    experts: [
      {
        id: 1,
        expertName: "Kenraaliluutnantti Pekka Toveri",
        expertOrganization: "Puolustusvoimat",
        hearingDate: "2026-02-05",
        committeeCode: "PuV",
        position: "puolesta",
        summaryFi: "Kertausharjoitusten pidentäminen on välttämätöntä reservin suorituskyvyn ylläpitämiseksi muuttuneessa turvallisuusympäristössä.",
        documentUrl: null,
      },
      {
        id: 2,
        expertName: "Prof. Matti Virtanen",
        expertOrganization: "Maanpuolustuskorkeakoulu",
        hearingDate: "2026-02-05",
        committeeCode: "PuV",
        position: "puolesta",
        summaryFi: "Tutkimuksen mukaan reservin koulutustason nostaminen edellyttää pidempää kertausharjoituskiertoa.",
        documentUrl: null,
      },
      {
        id: 3,
        expertName: "Anna Korhonen",
        expertOrganization: "Suomen Sadankomitea",
        hearingDate: "2026-02-07",
        committeeCode: "PuV",
        position: "vastaan",
        summaryFi: "Esitys kaventaa kansalaisten perusoikeuksia kohtuuttomasti suhteessa saavutettavaan puolustushyötyyn.",
        documentUrl: null,
      },
    ],
    votes: [
      {
        id: "v-2026-311",
        voteDate: "2026-03-10T14:32:00",
        votesFor: 134,
        votesAgainst: 47,
        votesAbsent: 18,
        votesEmpty: 0,
        result: "passed",
        mpVotes: [
          { mpName: "Petteri Orpo", party: "KOK", voteValue: "Jaa" },
          { mpName: "Riikka Purra", party: "PS", voteValue: "Jaa" },
          { mpName: "Antti Lindtman", party: "SDP", voteValue: "Ei" },
          { mpName: "Annika Saarikko", party: "KESK", voteValue: "Jaa" },
          { mpName: "Iiris Suomela", party: "VIHR", voteValue: "Ei" },
          { mpName: "Li Andersson", party: "VAS", voteValue: "Ei" },
          { mpName: "Anna-Maja Henriksson", party: "RKP", voteValue: "Jaa" },
          { mpName: "Sari Essayah", party: "KD", voteValue: "Jaa" },
        ],
      },
    ],
    documents: [
      {
        id: "HE 12/2026 vp",
        docType: "HE",
        titleFi: "Hallituksen esitys",
        publishedDate: "2026-01-20",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_12+2026.aspx",
      },
      {
        id: "PuVM 2/2026 vp",
        docType: "mietinto",
        titleFi: "Puolustusvaliokunnan mietintö",
        publishedDate: "2026-02-28",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/Mietinto/Sivut/PuVM_2+2026.aspx",
      },
    ],
  },
  {
    id: "HE 7/2026 vp",
    billType: "HE",
    billNumber: 7,
    billYear: 2026,
    titleFi: "Hallituksen esitys eduskunnalle sosiaali- ja terveydenhuollon uudistamislaiksi",
    summaryFi:
      "Esityksessä ehdotetaan uudistettavaksi sosiaali- ja terveydenhuollon palvelurakennetta. Tavoitteena on lyhentää hoitojonoja ja tehostaa palveluiden saatavuutta erityisesti harvaan asutuilla alueilla.",
    category: "Sosiaali- ja terveys",
    currentStage: "report",
    submittedDate: "2026-01-10",
    stageUpdatedAt: "2026-03-01",
    sponsor: "Valtioneuvosto",
    urgency: "high",
    keywords: ["sote", "terveydenhuolto", "hyvinvointialue", "hoitojono"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_7+2026.aspx",
    committees: [
      {
        committeeCode: "StV",
        committeeNameFi: "Sosiaali- ja terveysvaliokunta",
        role: "lead",
        reportId: "StVM 1/2026 vp",
        reportDate: "2026-03-01",
      },
    ],
    experts: [
      {
        id: 4,
        expertName: "Ylijohtaja Kirsi Varhila",
        expertOrganization: "STM",
        hearingDate: "2026-02-10",
        committeeCode: "StV",
        position: "puolesta",
        summaryFi: "Uudistus on välttämätön hoitojonojen lyhentämiseksi ja palveluiden yhdenvertaisuuden turvaamiseksi.",
        documentUrl: null,
      },
      {
        id: 5,
        expertName: "Prof. Marja-Liisa Manka",
        expertOrganization: "Tampereen yliopisto",
        hearingDate: "2026-02-10",
        committeeCode: "StV",
        position: "neutraali",
        summaryFi: "Uudistuksen tavoitteet ovat kannatettavia, mutta rahoituspohjan riittävyys herättää huolta.",
        documentUrl: null,
      },
    ],
    votes: [],
    documents: [
      {
        id: "HE 7/2026 vp",
        docType: "HE",
        titleFi: "Hallituksen esitys",
        publishedDate: "2026-01-10",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_7+2026.aspx",
      },
      {
        id: "StVM 1/2026 vp",
        docType: "mietinto",
        titleFi: "Sosiaali- ja terveysvaliokunnan mietintö",
        publishedDate: "2026-03-01",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/Mietinto/Sivut/StVM_1+2026.aspx",
      },
    ],
  },
  {
    id: "HE 19/2026 vp",
    billType: "HE",
    billNumber: 19,
    billYear: 2026,
    titleFi: "Hallituksen esitys eduskunnalle laiksi tuloverolain 127 a §:n muuttamisesta",
    summaryFi:
      "Esityksessä ehdotetaan kotitalousvähennyksen enimmäismäärää korotettavaksi 3 500 eurosta 3 750 euroon. Muutos helpottaa pienituloisten mahdollisuuksia käyttää kotitalouspalveluita.",
    category: "Verotus",
    currentStage: "hearing",
    submittedDate: "2026-02-03",
    stageUpdatedAt: "2026-03-08",
    sponsor: "Valtioneuvosto",
    urgency: "normal",
    keywords: ["kotitalousvähennys", "tulovero", "verotus"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_19+2026.aspx",
    committees: [
      {
        committeeCode: "VaV",
        committeeNameFi: "Valtiovarainvaliokunta",
        role: "lead",
        reportId: null,
        reportDate: null,
      },
    ],
    experts: [
      {
        id: 6,
        expertName: "Johtava veroasiantuntija Tero Honkanen",
        expertOrganization: "Verohallinto",
        hearingDate: "2026-03-05",
        committeeCode: "VaV",
        position: "neutraali",
        summaryFi: null,
        documentUrl: null,
      },
      {
        id: 7,
        expertName: "Toimitusjohtaja Leena Mäkinen",
        expertOrganization: "Kotityöpalveluyhdistys",
        hearingDate: "2026-03-05",
        committeeCode: "VaV",
        position: "puolesta",
        summaryFi: "Kotitalousvähennyksen korotus tukee alan kasvua ja vähentää harmaata taloutta.",
        documentUrl: null,
      },
    ],
    votes: [],
    documents: [
      {
        id: "HE 19/2026 vp",
        docType: "HE",
        titleFi: "Hallituksen esitys",
        publishedDate: "2026-02-03",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_19+2026.aspx",
      },
    ],
  },
  {
    id: "LA 3/2026 vp",
    billType: "LA",
    billNumber: 3,
    billYear: 2026,
    titleFi: "Lakialoite laiksi perusopetuslain 48 d §:n muuttamisesta (kerhotoiminta)",
    summaryFi:
      "Lakialoitteessa ehdotetaan, että koulujen kerhotoimintaan osoitettu määräraha palautetaan lakisääteiseksi velvoitteeksi. Tavoitteena on turvata lasten harrastusmahdollisuudet kaikissa kunnissa.",
    category: "Koulutus",
    currentStage: "committee",
    submittedDate: "2026-02-14",
    stageUpdatedAt: "2026-02-28",
    sponsor: "Kansanedustaja Sanna Grahn-Laasonen",
    urgency: "normal",
    keywords: ["perusopetus", "kerhotoiminta", "lapset", "harrastukset"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/Lakialoite/Sivut/LA_3+2026.aspx",
    committees: [
      {
        committeeCode: "SiV",
        committeeNameFi: "Sivistysvaliokunta",
        role: "lead",
        reportId: null,
        reportDate: null,
      },
    ],
    experts: [],
    votes: [],
    documents: [
      {
        id: "LA 3/2026 vp",
        docType: "LA",
        titleFi: "Lakialoite",
        publishedDate: "2026-02-14",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/Lakialoite/Sivut/LA_3+2026.aspx",
      },
    ],
  },
  {
    id: "HE 4/2026 vp",
    billType: "HE",
    billNumber: 4,
    billYear: 2026,
    titleFi: "Hallituksen esitys eduskunnalle laiksi rikoslain 17 luvun muuttamisesta",
    summaryFi:
      "Esityksessä ehdotetaan rikoslakiin lisättäväksi uusi säännös, joka kriminalisoi vieraan valtion hyväksi harjoitetun vaikuttamistoiminnan. Muutos vahvistaa Suomen kykyä torjua hybridivaikuttamista.",
    category: "Sisäinen turvallisuus",
    currentStage: "submitted",
    submittedDate: "2026-03-05",
    stageUpdatedAt: "2026-03-05",
    sponsor: "Valtioneuvosto",
    urgency: "high",
    keywords: ["rikoslaki", "hybridivaikuttaminen", "kansallinen turvallisuus"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_4+2026.aspx",
    committees: [],
    experts: [],
    votes: [],
    documents: [
      {
        id: "HE 4/2026 vp",
        docType: "HE",
        titleFi: "Hallituksen esitys",
        publishedDate: "2026-03-05",
        eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_4+2026.aspx",
      },
    ],
  },
  {
    id: "HE 55/2025 vp",
    billType: "HE",
    billNumber: 55,
    billYear: 2025,
    titleFi: "Hallituksen esitys eduskunnalle laiksi rakentamislain muuttamisesta",
    summaryFi:
      "Esityksessä ehdotetaan rakentamislain lupamenettelyjä sujuvoitettavaksi. Digitaalisten hakemusprosessien laajentaminen ja käsittelyaikojen lyhentäminen ovat keskeisiä tavoitteita.",
    category: "Ympäristö ja rakentaminen",
    currentStage: "enacted",
    submittedDate: "2025-09-15",
    stageUpdatedAt: "2026-01-20",
    sponsor: "Valtioneuvosto",
    urgency: "normal",
    keywords: ["rakentaminen", "luvat", "digitalisaatio", "kaavoitus"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/HallituksenEsitys/Sivut/HE_55+2025.aspx",
    committees: [
      {
        committeeCode: "YmV",
        committeeNameFi: "Ympäristövaliokunta",
        role: "lead",
        reportId: "YmVM 8/2025 vp",
        reportDate: "2025-11-20",
      },
    ],
    experts: [
      {
        id: 8,
        expertName: "Ylijohtaja Matti Kauppinen",
        expertOrganization: "Ympäristöministeriö",
        hearingDate: "2025-10-15",
        committeeCode: "YmV",
        position: "puolesta",
        summaryFi: null,
        documentUrl: null,
      },
    ],
    votes: [
      {
        id: "v-2025-892",
        voteDate: "2025-12-10T15:00:00",
        votesFor: 141,
        votesAgainst: 38,
        votesAbsent: 20,
        votesEmpty: 0,
        result: "passed",
        mpVotes: [
          { mpName: "Petteri Orpo", party: "KOK", voteValue: "Jaa" },
          { mpName: "Riikka Purra", party: "PS", voteValue: "Jaa" },
          { mpName: "Antti Lindtman", party: "SDP", voteValue: "Jaa" },
          { mpName: "Annika Saarikko", party: "KESK", voteValue: "Jaa" },
          { mpName: "Iiris Suomela", party: "VIHR", voteValue: "Ei" },
          { mpName: "Li Andersson", party: "VAS", voteValue: "Ei" },
          { mpName: "Anna-Maja Henriksson", party: "RKP", voteValue: "Jaa" },
          { mpName: "Sari Essayah", party: "KD", voteValue: "Jaa" },
        ],
      },
    ],
    documents: [
      {
        id: "HE 55/2025 vp",
        docType: "HE",
        titleFi: "Hallituksen esitys",
        publishedDate: "2025-09-15",
        eduskuntaUrl: "#",
      },
      {
        id: "YmVM 8/2025 vp",
        docType: "mietinto",
        titleFi: "Ympäristövaliokunnan mietintö",
        publishedDate: "2025-11-20",
        eduskuntaUrl: "#",
      },
      {
        id: "SK 12/2026",
        docType: "saadoskokoelma",
        titleFi: "Säädöskokoelma — Rakentamislain muutos",
        publishedDate: "2026-01-20",
        eduskuntaUrl: "https://www.finlex.fi/fi/laki/alkup/2026/20260012",
      },
    ],
  },
  {
    id: "KAA 1/2026 vp",
    billType: "KAA",
    billNumber: 1,
    billYear: 2026,
    titleFi: "Kansalaisaloite eläinten hyvinvointilain tiukentamiseksi turkistarhauksessa",
    summaryFi:
      "Kansalaisaloitteessa esitetään turkistarhaukselle tiukempia eläinsuojeluvaatimuksia. Aloitteen allekirjoitti yli 60 000 kansalaista.",
    category: "Eläinsuojelu",
    currentStage: "committee",
    submittedDate: "2026-01-28",
    stageUpdatedAt: "2026-02-20",
    sponsor: "Kansalaisaloite (62 441 allekirjoitusta)",
    urgency: "normal",
    keywords: ["eläinsuojelu", "turkistarhaus", "hyvinvointi"],
    eduskuntaUrl: "https://www.eduskunta.fi/FI/vaski/KansalaisAloite/Sivut/KAA_1+2026.aspx",
    committees: [
      {
        committeeCode: "MmV",
        committeeNameFi: "Maa- ja metsätalousvaliokunta",
        role: "lead",
        reportId: null,
        reportDate: null,
      },
    ],
    experts: [],
    votes: [],
    documents: [
      {
        id: "KAA 1/2026 vp",
        docType: "KAA",
        titleFi: "Kansalaisaloite",
        publishedDate: "2026-01-28",
        eduskuntaUrl: "#",
      },
    ],
  },
];

export const STAGE_COUNTS = SAMPLE_BILLS.reduce(
  (acc, bill) => {
    acc[bill.currentStage] = (acc[bill.currentStage] ?? 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

export const CATEGORIES = [...new Set(SAMPLE_BILLS.map((b) => b.category))].sort();
