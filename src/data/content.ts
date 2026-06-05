// src/data/content.ts
// Pełna narracja strony Nobelion. Filozofia: język korzyści, zero żargonu,
// editorial luxury (Monocle / Bloomberg w polskim wydaniu). Klient docelowy:
// nietechniczny właściciel polskiej małej i średniej firmy.

export const siteConfig = {
    title: "NOBELION | Automatyzacje AI i Systemy dla Firm",
    description: "Projektujemy automatyzacje AI i strony internetowe dla firm, które chcą rosnąć bez zatrudniania kolejnych ludzi. Brief w 2 minuty, plan i wycena w 24 godziny.",
    email: "kontakt@nobelion.pl",
    phone: "",
    url: "https://nobelion.pl"
}

export const heroData = {
    line1: "Oddajemy ci czas,",
    line2: "którego nie wiedziałeś,",
    line3: "że tracisz.",
    subheading: "Projektujemy automatyzacje i aplikacje, które oszczędzają godziny i podnoszą przychód. AI lub bez. Własne serwery lub n8n. Dedykowany kod lub make.com.",
    microTagline: "Architekci automatyzacji · 2025",
    scrollText: "Przewiń",
    primaryCta: { label: "Wypełnij brief", href: "#brief" },
    secondaryCta: { label: "Zobacz wdrożenia", href: "#cases" },
    stripe: [
        { k: "+230 000 zł", v: "przychodu w 9 mies." },
        { k: "+65%", v: "sprzedaży r/r" },
        { k: "1.5 roku → 1 tydz.", v: "pracy etatu" }
    ]
}

export const navigation = [
    { label: "Oferta",          href: "#oferta" },
    { label: "Wdrożenia",       href: "#wdrozenia" },
    { label: "Proces",          href: "#proces" },
    { label: "Bezpieczeństwo",  href: "#bezpieczenstwo" },
    { label: "FAQ",             href: "#faq" }
]

export const problemData = {
    sectionLabel: "PROBLEM",
    heading: "ROZPOZNAJESZ?",
    subheading: "Pięć sytuacji, które codziennie zjadają firmy w Polsce. Jeśli choć jedna brzmi znajomo, jesteś we właściwym miejscu.",
    pains: [
        { headline: "Twój zespół codziennie kopiuje dane między systemami.", body: "Excel, mail, sklep, magazyn, fakturowanie. Jedno zamówienie, pięć miejsc do wpisania. Pomyłka kosztuje godzinę. Czasem dzień.", costHint: "ok. 12h tygodniowo" },
        { headline: "Maile do potencjalnych klientów piszesz ręcznie.", body: "Wyszukiwanie firm, sprawdzenie strony, dopasowanie treści, wysyłka, odpowiedzi. Połowa zespołu sprzedaży w roli copywritera.", costHint: "ok. 20h tygodniowo" },
        { headline: "Klient pyta o wycenę. Robisz ją w Wordzie.", body: "Każda oferta to godzina pracy. Każda zmiana, kolejne pół. Klient czeka, konkurencja odpisuje szybciej.", costHint: "ok. 8h tygodniowo" },
        { headline: "Faktura, raport, podsumowanie miesiąca. Wieczór i weekend.", body: "Powtarzalne zadanie, którego nikt nie chce robić. Robi je więc właściciel. W godzinach, które miały być wolne.", costHint: "ok. 6h tygodniowo" },
        { headline: "Wiesz, że konkurencja używa AI. Nie wiesz od czego zacząć.", body: "Czytasz o ChatGPT, agentach, automatyzacjach. Brzmi mądrze. Nie wiesz, jak to przełożyć na swoją firmę.", costHint: "koszt ukryty" }
    ],
    closingLine: "Każde z tych zadań może wykonywać system. Bez kawy. Bez urlopu. Bez błędów. 24 godziny na dobę."
}

export const servicesData = {
    sectionLabel: "OFERTA",
    heading: "CO DLA CIEBIE BUDUJEMY",
    subheading: "Trzy drogi do tego samego celu — mniej zmarnowanego czasu, więcej przychodu. Dobieramy narzędzie do problemu, nie odwrotnie.",
    pillars: [
        { id: "01", name: "Dedykowane aplikacje i systemy", lead: "Aplikacje webowe z bazą, panelem administracyjnym i logowaniem.", body: "Pełna własność kodu i danych po odbiorze.", deliverables: ["Web app", "Panel admina", "API"], outcome: "Praca dwóch ludzi, którą wykonuje system." },
        { id: "02", name: "Automatyzacje n8n / make.com", lead: "Tam, gdzie kod to overkill — stawiamy orkiestrowane przepływy low-code.", body: "Szybko, mierzalnie, bez wendor-locku.", deliverables: ["n8n", "make.com", "Integracje"], outcome: "Cyfrowa twarz firmy, która przynosi konkretne leady." },
        { id: "03", name: "Wdrożenia AI w procesie", lead: "AI dokładamy tam, gdzie wnosi mierzalną wartość — klasyfikacja, generowanie treści, agenci.", body: "Nigdy dla samego AI.", deliverables: ["Agenci", "LLM", "Klasyfikacja"], outcome: "Narzędzie, którego nikt poza Tobą nie ma." }
    ]
}

export const capabilitiesData = [
    { icon: "lightning", title: "Automatyzacja procesów", desc: "Powtarzalna praca biurowa skompresowana do minut maszyny. Deterministyczna, audytowalna." },
    { icon: "workflow",  title: "Agent outbound", desc: "Skanuje firmy, pisze spersonalizowane maile, dostarcza gotowe do wysyłki — z panelem sterowania." },
    { icon: "diamond",   title: "Walidacja ROI", desc: "Liczymy zwrot zanim napiszemy linijkę kodu. Jeśli matematyka się nie spina — nie wdrażamy." },
    { icon: "shield",    title: "Bezpieczeństwo", desc: "Szyfrowanie Google KMS, logowanie bezhasłowe, zgodność z RODO i normami sektora medycznego." },
    { icon: "server",    title: "Serwery dedykowane", desc: "Hostujemy na własnej infrastrukturze. Bez subskrypcji od pierwszego dnia, bez uzależnienia." },
    { icon: "user",      title: "Jeden zespół", desc: "Programiści, automatyzatorzy i eksperci AI pod jednym dachem. Rozmawiasz z tymi, którzy budują." }
]

export const statsData = [
    { pre: "+", value: "230", suffix: "k zł", label: "przychodu wygenerowanego\nw 9 miesiącach" },
    { pre: "+", value: "65", suffix: "%", label: "wzrost sprzedaży r/r\nklinika medyczna" },
    { pre: "", value: "1", suffix: "tydz.", label: "zamiast 1.5 roku\npracy etatu" }
]

export const examplesData = {
    sectionLabel: "PRZYKŁADY",
    heading: "TO ROBIMY DLA KLIENTÓW",
    subheading: "Konkretne automatyzacje, które już dziś pracują w polskich firmach. Każda zaczęła się od jednego zdania w briefie.",
    items: [
        { title: "Bot, który skanuje firmy z LinkedIn i pisze maile sprzedażowe.", tag: "SPRZEDAŻ B2B" },
        { title: "Synchronizacja zamówień ze sklepu do magazynu i księgowości.", tag: "E-COMMERCE" },
        { title: "Generowanie ofert PDF z parametrów klienta w cztery sekundy.", tag: "USŁUGI" },
        { title: "Asystent AI w panelu klienta, który odpowiada na pytania 24/7.", tag: "OBSŁUGA KLIENTA" },
        { title: "Automatyczne raporty miesięczne z danych z wielu źródeł.", tag: "ZARZĄDZANIE" },
        { title: "System, który czyta zapytania z maila i wpisuje je do CRM.", tag: "SPRZEDAŻ" }
    ],
    closing: "I dziesiątki innych. Twój pomysł też się tu zmieści."
}

export const marqueeWords = ["Automatyzacja", "AI", "n8n", "make.com", "Dedykowany kod", "Serwery", "Google KMS", "ROI", "Outbound", "Integracje"]

export const casesData = {
    sectionLabel: "Wdrożenia",
    heading: "Liczby, które się obroniły",
    subheading: "Realne, wdrożone projekty. Każdy mierzony twardym wynikiem: godziny pracy, przychód, błędy.",
    items: [
        { id: "01", image: "/showcase_sales_engine.png", kicker: "Klinika medyczna · Silnik sprzedaży", title: "+65% sprzedaży rok do roku", metric: "+230 000 zł", metricLabel: "przychodu w 9 miesięcy", desc: "Dedykowana automatyzacja generująca leady, kwalifikująca pacjentów i synchronizująca kalendarz lekarzy.", steps: ["Audyt ścieżki pacjenta", "Silnik leadów + kwalifikacja", "Synchronizacja kalendarza", "Pomiar i optymalizacja"] },
        { id: "02", image: "/showcase_back_office.png", kicker: "Klinika medyczna · Back-office", title: "1.5 roku pracy → 1 tydzień", metric: "~98%", metricLabel: "mniej czasu operacyjnego", desc: "Proces, który zająłby etatowi 1.5 roku, skompresowany do tygodnia czasu maszyny. Pełna ścieżka audytu w bazie.", steps: ["Mapowanie procesu", "Automatyzacja przepływu", "Ścieżka audytu w bazie", "Przekazanie zespołowi"] },
        { id: "03", image: "/showcase_outbound_agent.png", kicker: "Produkt własny · Agent outbound", title: "Outbound, który pisze sam", metric: "24/7", metricLabel: "autonomicznej pracy", desc: "System sam szuka firm, skanuje ich strony i pisze spersonalizowane maile. Strona, panel, baza i KMS pod jedną domeną.", steps: ["Wyszukiwanie firm", "Scraping i analiza", "Personalizacja maili", "Gotowe drafty w skrzynce"] }
    ]
}

export const processData = {
    sectionLabel: "PROCES",
    heading: "JAK WYGLĄDA WSPÓŁPRACA",
    subheading: "Każdy etap ma checkpoint, na którym możesz wcisnąć stop. Bez niespodzianek, bez ukrytych kosztów.",
    steps: [
        { n: "01", title: "Brief i audyt", time: "3–5 dni", desc: "Wypełniasz brief, my audytujemy proces i liczymy ROI. Dostajesz wycenę zakresu i rekomendację narzędzia." },
        { n: "02", title: "Projekt rozwiązania", time: "Tydzień", desc: "Projektujemy architekturę, ustalamy kamienie milowe i mierniki sukcesu. Decyzję podejmujesz na konkretach." },
        { n: "03", title: "Wdrożenie", time: "1–10 tyg.", desc: "Budujemy etapami. Prosty proces n8n — 1–2 tygodnie. Dedykowany serwis z bazą i panelem — 4–10 tygodni." },
        { n: "04", title: "Przekazanie", time: "Odbiór", desc: "Kod, dane i konta migrujemy do twojej organizacji. Bez vendor-locku. Utrzymujemy klientów, bo wracają." }
    ]
}

export const audienceData = {
    sectionLabel: "DLA KOGO",
    heading: "JEŚLI JESTEŚ Z...",
    subheading: "Pracujemy z polskimi firmami, niezależnie od branży. Poniżej najczęstsze obszary, w których przynosimy konkretne efekty.",
    segments: [
        { number: "01", name: "E-COMMERCE", typical: "Synchronizacja zamówień, monitorowanie cen konkurencji, generatory opisów, automatyczne maile po zakupie." },
        { number: "02", name: "BIURA KSIĘGOWE I PRAWNE", typical: "Kategoryzacja faktur, generowanie JPK, automatyzacja korespondencji, panele klientów." },
        { number: "03", name: "AGENCJE MARKETINGOWE", typical: "Generatory treści, raporty kampanii, automatyzacja onboardingu klientów, integracje narzędzi." },
        { number: "04", name: "SPRZEDAŻ B2B", typical: "Cold outreach z personalizacją, scoring leadów, follow-up po spotkaniach, integracje CRM." },
        { number: "05", name: "PRODUKCJA I HURT", typical: "Zarządzanie magazynem, zamówienia od kontrahentów, raporty produkcyjne, integracje logistyczne." },
        { number: "06", name: "USŁUGI LOKALNE", typical: "Rezerwacje online, przypomnienia SMS, panele klienta, automatyczne ankiety satysfakcji." }
    ],
    closing: "Nie widzisz swojej branży? Brief jest otwarty dla każdego."
}

export const faqData = [
    { question: "Czy potrzebuję AI, żeby zautomatyzować firmę?", answer: "Nie. AI to jedno z pięciu narzędzi w naszym arsenale. Najlepsze automatyzacje są deterministyczne — uruchamiają się o tej samej godzinie, robią to samo, kosztują grosze. AI dokładamy tam, gdzie wnosi mierzalną wartość." },
    { question: "Jak rozliczacie wdrożenie?", answer: "Stawka za projekt po wycenie zakresu. W złożonych implementacjach — kontrakt z kamieniami milowymi i procentem od zaoszczędzonych godzin lub wygenerowanego przychodu. Decyzję podejmujesz po audycie." },
    { question: "Czy kod należy do mnie po wdrożeniu?", answer: "Tak. Kod, dane i konta migrujemy do twojej organizacji w momencie odbioru. Nie utrzymujemy klientów na smyczy — utrzymujemy ich, bo wracają." },
    { question: "Jak długo trwa typowe wdrożenie?", answer: "Audyt 3–5 dni. Prosty proces n8n: 1–2 tygodnie. Dedykowany serwis z bazą i panelem: 4–10 tygodni. Każdy etap ma checkpoint, na którym możesz wcisnąć stop." },
    { question: "Dla jakich firm pracujecie?", answer: "MŚP usługowe, e-commerce, kliniki i sektor medyczny oraz szeroko rozumiane B2B. Jeśli masz powtarzalny proces, który zjada czas — prawdopodobnie umiemy go zautomatyzować." }
]

export const securityData = {
    sectionLabel: "Bezpieczeństwo",
    heading: "Zbudowane na zaufaniu",
    subheading: "Pracujemy z danymi medycznymi i finansowymi. Standard bezpieczeństwa nie jest opcją — jest fundamentem.",
    items: [
        { icon: "lock",   title: "Szyfrowanie Google KMS", desc: "Klucze zarządzane przez Google Cloud KMS. Dane wrażliwe szyfrowane w spoczynku i w tranzycie." },
        { icon: "shield", title: "Logowanie bezhasłowe", desc: "Magic-link i klucze sprzętowe zamiast haseł. Mniejsza powierzchnia ataku, mniej phishingu." },
        { icon: "diamond",title: "Zgodność z RODO", desc: "Minimalizacja danych, prawo do usunięcia, rejestr czynności. Zgodność z normami sektora medycznego." },
        { icon: "server", title: "Pełna ścieżka audytu", desc: "Każda operacja zapisana w bazie. Wiesz kto, co i kiedy — dla compliance i Twojego spokoju." }
    ]
}

export const contactData = {
    eyebrow: "ZACZYNAMY",
    heading: "OPISZ PROBLEM. RESZTĘ POLICZYMY MY.",
    body: "Wypełnienie briefu zajmuje kilka minut. Po wysłaniu odzywamy się w ciągu 24 godzin roboczych. Nie sprzedajemy — rozmawiamy o tym, czy ma to sens.",
    company: "NOBELION SP. Z O.O.",
    rows: [
      { k: "Adres", v: "ul. Pamiątkowa 2, 61-512 Poznań" },
      { k: "NIP", v: "783-189-80-94" },
      { k: "REGON", v: "527810001" },
      { k: "KRS", v: "0001088524" },
      { k: "Email", v: "kontakt@nobelion.pl" }
    ]
}

export const legalContent = {
    privacy: {
        title: "POLITYKA PRYWATNOŚCI",
        date: "OSTATNIA AKTUALIZACJA: 28.04.2026",
        sections: [
            { heading: "I. ADMINISTRATOR DANYCH", content: "Administratorem danych osobowych jest NOBELION SP. Z O.O. z siedzibą w Poznaniu, ul. Pamiątkowa 2, 61-512 Poznań, wpisana do rejestru przedsiębiorców pod numerem KRS: 0001088524, NIP: 7831898094. Ochrona danych osobowych jest dla nas priorytetem operacyjnym i fundamentem zaufania klientów." },
            { heading: "II. ZAKRES PRZETWARZANIA", content: "Przetwarzamy dane niezbędne do realizacji zleceń projektowych, świadczenia usług automatyzacji AI, tworzenia oprogramowania na zamówienie, prowadzenia korespondencji handlowej oraz wystawiania dokumentów księgowych. Dane przechowujemy na infrastrukturze w Unii Europejskiej, szyfrowane w spoczynku oraz w transmisji." },
            { heading: "III. PLIKI COOKIES I ANALITYKA", content: "Strona wykorzystuje pliki cookies w celu optymalizacji doświadczeń użytkownika oraz analizy ruchu. Masz prawo do zarządzania ustawieniami prywatności z poziomu przeglądarki." },
            { heading: "IV. PRAWA UŻYTKOWNIKA", content: "Przysługuje Ci prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. W sprawach związanych z ochroną danych skontaktuj się z nami pod adresem kontakt@nobelion.pl." }
        ]
    },
    terms: {
        title: "REGULAMIN ŚWIADCZENIA USŁUG",
        date: "WERSJA 3.0 / 2026",
        sections: [
            { heading: "I. POSTANOWIENIA OGÓLNE", content: "Niniejszy regulamin określa zasady korzystania z serwisu nobelion.pl oraz świadczenia usług projektowania automatyzacji AI, tworzenia stron internetowych i oprogramowania na zamówienie przez NOBELION SP. Z O.O." },
            { heading: "II. ZAKRES USŁUG", content: "Usługodawca świadczy usługi w trzech głównych obszarach: automatyzacje procesów biznesowych z wykorzystaniem AI, projektowanie i wdrażanie stron internetowych oraz aplikacji webowych, tworzenie oprogramowania szytego na miarę. Każde wdrożenie poprzedza brief i pisemna wycena." },
            { heading: "III. PROCES WSPÓŁPRACY", content: "Współpraca rozpoczyna się od wypełnienia formularza zgłoszeniowego (briefu). W ciągu 24 do 48 godzin roboczych Klient otrzymuje plan działania i wycenę. Akceptacja wyceny i opłacenie pierwszej transzy są warunkiem rozpoczęcia prac wdrożeniowych." },
            { heading: "IV. PRAWA AUTORSKIE", content: "Materiały wizualne, kod źródłowy, logotypy oraz architektura informacji serwisu nobelion.pl są własnością intelektualną NOBELION SP. Z O.O. Prawa do oprogramowania zamówionego przez Klienta przekazywane są zgodnie z postanowieniami umowy projektowej." }
        ]
    },
    rodo: {
        title: "KLAUZULA INFORMACYJNA RODO",
        date: "ZGODNOŚĆ Z ROZPORZĄDZENIEM UE 2016/679",
        sections: [
            { heading: "I. PRAWA UŻYTKOWNIKA", content: "Zgodnie z art. 13 RODO informujemy, że przysługuje Ci prawo do dostępu do swoich danych, ich sprostowania, usunięcia (prawo do bycia zapomnianym), ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu." },
            { heading: "II. PODSTAWA PRAWNA PRZETWARZANIA", content: "Dane przetwarzane są na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy) oraz lit. f RODO (uzasadniony interes administratora) w zakresie korespondencji handlowej i marketingu bezpośredniego usług własnych." },
            { heading: "III. KONTAKT", content: "W sprawach ochrony danych osobowych skontaktuj się z nami pod adresem kontakt@nobelion.pl. Odpowiadamy w terminie do 30 dni." }
        ]
    }
};


export const bentoGridItems = [
    { title: "Niezawodność", description: "Zaprojektowane dla zerowej tolerancji na błędy", icon: "shield", colSpan: 1 },
    { title: "Szybkość", description: "Maksymalnie zoptymalizowane działanie", icon: "lightning", colSpan: 2 },
    { title: "Skalowalność", description: "Gotowe na dowolny wzrost", icon: "server", colSpan: 1 }
];

export interface DivisionItem {
    id: string;
    title: string;
    description: string;
}

export const divisionsData: DivisionItem[] = [
    {
        id: "01",
        title: "SYSTEMS",
        description: "Projektowanie i wdrażanie dedykowanych systemów operacyjnych oraz aplikacji webowych, które zastępują manualną pracę wielu osób."
    },
    {
        id: "02",
        title: "FLOWS",
        description: "Orkiestracja procesów biznesowych i integracje API za pomocą narzędzi low-code / no-code (n8n, make.com) bez niepotrzebnych kosztów licencyjnych."
    },
    {
        id: "03",
        title: "AGENTS",
        description: "Implementacja autonomicznych agentów AI i modeli LLM wykonujących zaawansowane zadania analityczne, komunikacyjne oraz research."
    }
];
