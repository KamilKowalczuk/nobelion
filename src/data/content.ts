// src/data/content.ts
// Pełna narracja strony Nobelion. Filozofia: język korzyści, zero żargonu,
// editorial luxury (Monocle / Bloomberg w polskim wydaniu). Klient docelowy:
// nietechniczny właściciel polskiej małej i średniej firmy.

import showcaseSalesEngine from '../assets/showcase_sales_engine.jpg';
import showcaseBackOffice from '../assets/showcase_back_office.jpg';
import showcaseOutboundAgent from '../assets/showcase_outbound_agent.jpg';

export const siteConfig = {
    title: "NOBELION | Automatyzacje AI i Systemy dla Firm",
    description: "Projektujemy automatyzacje AI i dedykowane systemy dla firm, które chcą rosnąć bez zatrudniania kolejnych osób. Brief w 2 minuty, konkretna wycena w 24 godziny.",
    email: "kontakt@nobelion.pl",
    phone: "",
    url: "https://nobelion.pl"
}

export const heroData = {
    line1: "Oddajemy Ci czas,",
    line2: "którego nie wiedziałeś,",
    line3: "że tracisz.",
    subheading: "Budujemy automatyzacje i dedykowane systemy, które przejmują powtarzalną pracę Twojego zespołu. Zanim cokolwiek wdrożymy, liczymy, czy inwestycja się zwróci — jeśli nie, powiemy wprost.",
    microTagline: "Architekci automatyzacji",
    scrollText: "Przewiń",
    primaryCta: { label: "Wypełnij brief", href: "#brief" },
    secondaryCta: { label: "Zobacz wdrożenia", href: "#wdrozenia" },
    stripe: [
        { k: "+230 000 zł", v: "przychodu klienta w 9 mies." },
        { k: "+65%", v: "sprzedaży rok do roku" },
        { k: "1,5 roku → 1 tydz.", v: "ręcznej pracy etatu" }
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
    subheading: "Trzy drogi do tego samego celu: mniej ręcznej pracy, więcej przychodu. Najpierw słuchamy, na czym tracisz czas — potem dobieramy narzędzie. Nigdy odwrotnie.",
    pillars: [
        { id: "01", name: "Dedykowane aplikacje i systemy", lead: "Aplikacja z bazą danych i panelem, zbudowana dokładnie pod Twój proces — nie szablon, który „prawie pasuje”.", body: "Po odbiorze kod i dane należą w całości do Ciebie.", deliverables: ["Aplikacja webowa", "Panel administracyjny", "Integracje"], outcome: "Praca dwóch osób, którą wykonuje system." },
        { id: "02", name: "Szybkie automatyzacje procesów", lead: "Łączymy programy, których już używasz — pocztę, arkusze, sklep, fakturowanie — żeby dane przepisywały się same.", body: "Gotowe w tygodnie, nie miesiące. Rosną razem z firmą.", deliverables: ["n8n", "make.com", "Integracje"], outcome: "Zamówienie obsłużone w minutę zamiast w kwadrans." },
        { id: "03", name: "Wdrożenia AI w procesie", lead: "Sztuczną inteligencję wdrażamy tam, gdzie realnie zarabia: pisanie ofert, analiza zgłoszeń, odpowiedzi na zapytania.", body: "Nigdy po to, żeby tylko „mieć AI”.", deliverables: ["Agenci AI", "Analiza treści", "Generowanie ofert"], outcome: "Narzędzie, którego nie ma Twoja konkurencja." }
    ]
}

export const capabilitiesData = [
    { icon: "lightning", title: "Automatyzacja procesów", desc: "Powtarzalna praca biurowa wykonana w minuty — zawsze tak samo, z zapisem każdej operacji." },
    { icon: "workflow",  title: "Agent sprzedażowy", desc: "Sam znajduje firmy, czyta ich strony i przygotowuje spersonalizowane maile. Ty tylko zatwierdzasz." },
    { icon: "diamond",   title: "Najpierw rachunek", desc: "Zanim napiszemy linijkę kodu, liczymy zwrot z inwestycji. Jeśli się nie opłaca — odradzimy." },
    { icon: "shield",    title: "Bezpieczeństwo", desc: "Szyfrowanie klasy bankowej, zgodność z RODO i wymogami sektora medycznego." },
    { icon: "server",    title: "Serwer pod Twój system", desc: "Dobieramy i konfigurujemy serwer lub hosting dopasowany do aplikacji, którą budujemy. Płacisz za to, czego używasz." },
    { icon: "user",      title: "Jeden zespół", desc: "Rozmawiasz bezpośrednio z ludźmi, którzy budują Twój system. Bez pośredników." }
]

export const statsData = [
    { pre: "+", value: "230", suffix: "k zł", label: "przychodu klienta\nw 9 miesięcy" },
    { pre: "+", value: "65", suffix: "%", label: "wzrostu sprzedaży\nrok do roku" },
    { pre: "", value: "1", suffix: "tydz.", label: "zamiast 1,5 roku\nręcznej pracy" }
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

export const marqueeWords = ["Automatyzacje", "Sztuczna inteligencja", "Dedykowane systemy", "Integracje", "Sprzedaż B2B", "Oferty w sekundy", "Raporty bez klikania", "Bezpieczeństwo danych", "Zwrot z inwestycji", "Mniej ręcznej pracy"]

export const casesData = {
    sectionLabel: "Wdrożenia",
    heading: "Liczby, które się obroniły",
    subheading: "Trzy wdrożenia, trzy twarde wyniki. Bez retuszu — tak to wygląda u klientów.",
    items: [
        { id: "01", image: showcaseSalesEngine, kicker: "Klinika medyczna · Powroty pacjentek", title: "+65% sprzedaży rok do roku", metric: "+230 000 zł", metricLabel: "przychodu w 9 miesięcy", desc: "Baza 100 000 pacjentek pilnuje się sama. System pamięta, kiedy każda z nich może wrócić na badanie, i na dwa miesiące przed terminem podaje rejestracji gotową listę do obdzwonienia. Wcześniej ten proces nie istniał — był niemożliwy do ogarnięcia w Excelu.", steps: ["Audyt ścieżki pacjentki", "System przypomnień w bazie", "Gotowe listy dla rejestracji", "Pomiar wyników co miesiąc"] },
        { id: "02", image: showcaseBackOffice, kicker: "Klinika medyczna · Weryfikacja NFZ", title: "1,5 roku pracy → 1 tydzień", metric: "2000/h", metricLabel: "rekordów sprawdza system — pracownik 120 dziennie", desc: "Pracownik sprawdzał ręcznie 120 uprawnień dziennie w rządowym portalu NFZ. System sprawdza 2000 na godzinę i sam nanosi wyniki do bazy. Zespół dzwoni tylko do osób, którym badanie faktycznie przysługuje — zamiast tracić czas na odmowy.", steps: ["Mapowanie procesu", "Automat w portalu NFZ", "Wyniki prosto do bazy", "Przekazanie zespołowi"] },
        { id: "03", image: showcaseOutboundAgent, kicker: "Produkt własny · Agent sprzedaży", title: "Sprzedaż, która pisze się sama", metric: "24/7", metricLabel: "pracy bez udziału człowieka", desc: "System sam znajduje firmy, czyta ich strony i przygotowuje spersonalizowane maile — kilkanaście dziennie, każdego dnia, także w weekendy. Handlowiec zaczyna pracę od gotowych wiadomości w skrzynce, zamiast od godzin szukania kontaktów.", steps: ["Wyszukiwanie firm", "Analiza ich stron", "Personalizowane maile", "Gotowe wiadomości w skrzynce"] }
    ]
}

export const processData = {
    sectionLabel: "PROCES",
    heading: "JAK WYGLĄDA WSPÓŁPRACA",
    subheading: "Cztery etapy, zero niespodzianek. Po każdym możesz powiedzieć stop — bez kar i bez tłumaczenia się.",
    steps: [
        { n: "01", title: "Brief i audyt", time: "3–5 dni", desc: "Wypełniasz brief w kilka minut, własnymi słowami. My przyglądamy się procesowi, liczymy, ile firma na nim traci, i odsyłamy wycenę z konkretnym planem." },
        { n: "02", title: "Projekt rozwiązania", time: "Tydzień", desc: "Pokazujemy, co dokładnie powstanie, w jakich etapach i po czym poznasz, że działa. Decyzję podejmujesz na konkretach, nie na obietnicach." },
        { n: "03", title: "Wdrożenie", time: "1–10 tyg.", desc: "Budujemy etapami i na bieżąco pokazujemy postępy. Prosta automatyzacja: 1–2 tygodnie. System z bazą i panelem: 4–10 tygodni." },
        { n: "04", title: "Przekazanie", time: "Odbiór", desc: "Kod, dane i dostępy przechodzą na Twoją firmę. Nic Cię z nami nie wiąże — klienci zostają, bo system zarabia, nie dlatego, że muszą." }
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
    { question: "Czy potrzebuję AI, żeby zautomatyzować firmę?", answer: "Nie. Najlepsze automatyzacje to często zwykłe, przewidywalne systemy: uruchamiają się o czasie, robią dokładnie to samo i kosztują grosze. Sztuczną inteligencję dokładamy tylko tam, gdzie przynosi policzalny zysk — nie dlatego, że jest modna." },
    { question: "Jak rozliczacie wdrożenie?", answer: "Stała kwota za ustalony zakres — znasz ją przed startem, po audycie. Większe projekty dzielimy na etapy i płacisz po odbiorze każdego z nich. Możliwe też rozliczenie częściowo od efektu, np. od zaoszczędzonych godzin. Bez ukrytych kosztów." },
    { question: "Czy kod należy do mnie po wdrożeniu?", answer: "Tak. Przy odbiorze przekazujemy kod, dane i wszystkie dostępy na Twoją firmę. Nie trzymamy klientów na smyczy — wracają, bo widzą wyniki." },
    { question: "Jak długo trwa typowe wdrożenie?", answer: "Audyt: 3–5 dni. Prosta automatyzacja: 1–2 tygodnie. Dedykowany system z bazą i panelem: 4–10 tygodni. Po każdym etapie możesz powiedzieć stop." },
    { question: "Nie znam się na technologii. Czy to problem?", answer: "Żaden. Brief jest po polsku, plan jest po polsku, a naszą rolą jest tłumaczenie trudnych rzeczy na język firmy. Wystarczy, że wiesz, co Cię uwiera w codziennej pracy — resztę sprawdzimy za Ciebie." }
]

export const securityData = {
    sectionLabel: "Bezpieczeństwo",
    heading: "Zbudowane na zaufaniu",
    subheading: "Pracujemy z danymi medycznymi i finansowymi. Standard bezpieczeństwa nie jest u nas opcją — jest punktem wyjścia.",
    items: [
        { icon: "lock",   title: "Szyfrowanie klasy bankowej", desc: "Dane wrażliwe są zaszyfrowane podczas przechowywania i przesyłania. Kluczami zarządza Google Cloud." },
        { icon: "shield", title: "Logowanie bez haseł", desc: "Jednorazowe linki i klucze sprzętowe zamiast haseł, które można wykraść albo zgubić." },
        { icon: "diamond",title: "Zgodność z RODO", desc: "Zbieramy tylko niezbędne dane i zawsze wiemy, gdzie się znajdują. Spełniamy wymogi sektora medycznego." },
        { icon: "server", title: "Pełna historia operacji", desc: "Każde działanie systemu zostaje zapisane. Zawsze wiesz, kto zrobił co i kiedy." }
    ]
}

export const contactData = {
    eyebrow: "ZACZYNAMY",
    heading: "OPISZ PROBLEM. RESZTĘ POLICZYMY MY.",
    body: "Brief to kilka prostych pytań — wypełnisz go w parę minut, bez technicznego słownika. W ciągu 24 godzin roboczych dostaniesz konkrety: co da się zautomatyzować, ile to kosztuje i kiedy się zwróci. A jeśli uznamy, że to się nie opłaca — też powiemy wprost.",
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
