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
    heading: "AUTOMATYZUJEMY",
    subheading: "Pracę, której nie chcesz już nigdy więcej robić.",
    microTagline: "PROJEKTUJEMY SYSTEMY AI DLA FIRM, KTÓRE CHCĄ ROSNĄĆ BEZ ZATRUDNIANIA",
    scrollText: "POZNAJ SYSTEM",
    primaryCta: { label: "ROZPOCZNIJ BRIEF, 2 MIN", href: "#brief" },
    secondaryCta: { label: "ZOBACZ JAK PRACUJEMY", href: "#problem" }
}

export const navigation = [
    { number: "01", label: "START", href: "#hero" },
    { number: "02", label: "PROBLEM", href: "#problem" },
    { number: "03", label: "USŁUGI", href: "#services" },
    { number: "04", label: "DOWODY", href: "#cases" },
    { number: "05", label: "PROCES", href: "#process" },
    { number: "06", label: "BRIEF", href: "#brief" }
]

export const problemData = {
    sectionLabel: "PROBLEM",
    heading: "ROZPOZNAJESZ?",
    subheading: "Pięć sytuacji, które codziennie zjadają firmy w Polsce. Jeśli choć jedna brzmi znajomo, jesteś we właściwym miejscu.",
    pains: [
        {
            headline: "Twój zespół codziennie kopiuje dane między systemami.",
            body: "Excel, mail, sklep, magazyn, fakturowanie. Jedno zamówienie, pięć miejsc do wpisania. Pomyłka kosztuje godzinę. Czasem dzień.",
            costHint: "ok. 12h tygodniowo"
        },
        {
            headline: "Maile do potencjalnych klientów piszesz ręcznie.",
            body: "Wyszukiwanie firm, sprawdzenie strony, dopasowanie treści, wysyłka, odpowiedzi. Połowa zespołu sprzedaży w roli copywritera.",
            costHint: "ok. 20h tygodniowo"
        },
        {
            headline: "Klient pyta o wycenę. Robisz ją w Wordzie.",
            body: "Każda oferta to godzina pracy. Każda zmiana, kolejne pół. Klient czeka, konkurencja odpisuje szybciej.",
            costHint: "ok. 8h tygodniowo"
        },
        {
            headline: "Faktura, raport, podsumowanie miesiąca. Wieczór i weekend.",
            body: "Powtarzalne zadanie, którego nikt nie chce robić. Robi je więc właściciel. W godzinach, które miały być wolne.",
            costHint: "ok. 6h tygodniowo"
        },
        {
            headline: "Wiesz, że konkurencja używa AI. Nie wiesz od czego zacząć.",
            body: "Czytasz o ChatGPT, agentach, automatyzacjach. Brzmi mądrze. Nie wiesz, jak to przełożyć na swoją firmę.",
            costHint: "koszt ukryty"
        }
    ],
    closingLine: "Każde z tych zadań może wykonywać system. Bez kawy. Bez urlopu. Bez błędów. 24 godziny na dobę."
}

export const servicesData = {
    sectionLabel: "CO ROBIMY",
    heading: "TRZY FILARY",
    subheading: "Każda firma jest inna, ale problemy mają wspólny mianownik. Działamy w trzech obszarach.",
    pillars: [
        {
            id: "01",
            name: "AUTOMATYZACJE AI",
            lead: "Systemy, które robią pracę za Twoich ludzi.",
            body: "Boty, które piszą maile. Procesy, które same się wykonują. Integracje, które łączą Twoje narzędzia w jeden organizm. Zaczynamy od jednego konkretnego problemu, kończymy na działającym rozwiązaniu.",
            deliverables: [
                "Bot mailingowy z personalizacją na bazie danych firm",
                "Synchronizacja danych między sklepem, magazynem i księgowością",
                "Automatyczne generowanie ofert, faktur i raportów"
            ],
            outcome: "Praca dwóch ludzi, którą wykonuje system."
        },
        {
            id: "02",
            name: "STRONY I SYSTEMY",
            lead: "Strona, która sprzedaje. Panel, który pracuje.",
            body: "Strony internetowe, które konwertują, a nie tylko ładnie wyglądają. Panele administracyjne, które naprawdę ułatwiają codzienną pracę. Sklepy, formularze, kalkulatory, każdy element zaprojektowany pod konkretny cel biznesowy.",
            deliverables: [
                "Strony sprzedażowe i landing page",
                "Panele klienta i panele administracyjne",
                "Formularze, kalkulatory, konfiguratory produktów"
            ],
            outcome: "Cyfrowa twarz firmy, która przynosi konkretne leady."
        },
        {
            id: "03",
            name: "OPROGRAMOWANIE NA MIARĘ",
            lead: "Kiedy gotowe rozwiązania nie wystarczają.",
            body: "Aplikacje webowe i systemy szyte pod jeden konkretny biznes. Nie kupujesz subskrypcji. Masz własne, działające narzędzie, które rozwiązuje Twój problem. Hostujemy, utrzymujemy, rozwijamy.",
            deliverables: [
                "Aplikacje SaaS i wewnętrzne systemy operacyjne",
                "Integracje z API zewnętrznych usług",
                "Wsparcie techniczne i rozwój po wdrożeniu"
            ],
            outcome: "Narzędzie, którego nikt poza Tobą nie ma."
        }
    ]
}

export const examplesData = {
    sectionLabel: "PRZYKŁADY",
    heading: "TO ROBIMY DLA NASZYCH KLIENTÓW",
    subheading: "Konkretne automatyzacje, które już dziś pracują w polskich firmach. Każda zaczęła się od jednego zdania w briefie.",
    items: [
        {
            title: "Bot, który skanuje firmy z LinkedIn i pisze spersonalizowane maile sprzedażowe.",
            tag: "SPRZEDAŻ B2B"
        },
        {
            title: "Synchronizacja zamówień ze sklepu do magazynu i księgowości w czasie rzeczywistym.",
            tag: "E-COMMERCE"
        },
        {
            title: "Generowanie ofert PDF z parametrów klienta w cztery sekundy.",
            tag: "USŁUGI"
        },
        {
            title: "Asystent AI w panelu klienta, który odpowiada na pytania o produkty 24 godziny na dobę.",
            tag: "OBSŁUGA KLIENTA"
        },
        {
            title: "Automatyczne raporty miesięczne z danych z pięciu źródeł, gotowe pierwszego dnia każdego miesiąca.",
            tag: "ZARZĄDZANIE"
        },
        {
            title: "System, który czyta zapytania ofertowe z maila i wpisuje je do CRM bez udziału człowieka.",
            tag: "SPRZEDAŻ"
        },
        {
            title: "Bot na Allegro, który monitoruje ceny konkurencji i sugeruje zmiany własnych ofert.",
            tag: "E-COMMERCE"
        },
        {
            title: "Generator treści produktowych dla sklepu, który pisze opisy SEO z surowych danych technicznych.",
            tag: "MARKETING"
        },
        {
            title: "Panel księgowego, który automatycznie kategoryzuje faktury i przygotowuje JPK.",
            tag: "BIURO KSIĘGOWE"
        }
    ],
    closing: "I dziesiątki innych. Twój pomysł też się tu zmieści."
}

export const casesData = {
    sectionLabel: "DOWODY",
    heading: "TO JUŻ DZIAŁA",
    subheading: "Trzy wdrożenia z ostatnich 12 miesięcy. Różne branże, te same efekty.",
    items: [
        {
            id: "01",
            industry: "PRYWATNA KLINIKA",
            challenge: "Klinika z ponad 100 pracownikami regularnie traciła pacjentki. Każda może wykonać mammografię raz na dwa lata — ale nikt nie wiedział, do której kiedy zadzwonić. Excel z setkami wierszy to był chaos. Pacjentki 'ginęły' w bazie i nikt do nich nie wracał.",
            solution: "Zbudowaliśmy prostą bazę danych z jedną zasadą: po badaniu pacjentka 'śpi' przez dwa lata, a dwa miesiące przed kolejnym terminem — sama trafia na listę do kontaktu. Rano pracownik otwiera jeden ekran i widzi, do kogo dziś dzwonić.",
            result: "+65% sprzedaży, 240 000 zł w 9 miesięcy",
            duration: "Wdrożenie: 3 tygodnie",
            note: "Klient z sektora prywatnej opieki zdrowotnej, 100+ pracowników."
        },
        {
            id: "02",
            industry: "PRYWATNA KLINIKA",
            challenge: "Ta sama klinika miała 100 000 pacjentek do sprawdzenia w systemie NFZ. Każda weryfikacja: kopiuj PESEL, wklej, kliknij, odczytaj wynik, wróć, zaktualizuj bazę. Jeden pracownik — 120 rekordów dziennie. Pełne sprawdzenie listy: dwa lata.",
            solution: "Bot, który robi to sam. Loguje się do systemu NFZ, pobiera pacjentki z bazy i sprawdza je kolejno — automatycznie aktualizując statusy. Pracownicy dostają każdego ranka gotową listę: tylko osoby z aktywnym ubezpieczeniem, gotowe do kontaktu.",
            result: "2 000 rekordów na godzinę. Praca dwóch lat skończyła się w miesiąc.",
            duration: "Czas wdrożenia: 4 tygodnie",
            note: "Oszczędność odpowiada dwóm latom wynagrodzenia na poziomie minimalnej krajowej."
        },
        {
            id: "03",
            industry: "SPRZEDAŻ B2B",
            challenge: "Klient potrzebował stałego strumienia nowych kontaktów biznesowych. Ręczne szukanie firm, przeglądanie ich stron, napisanie dobrego maila — minimum 30 minut na jeden kontakt. Dziennie kilka wysyłek, w miesiącu kilkadziesiąt.",
            solution: "Bot, który robi to za niego. Sam wyszukuje firmy pasujące do jego profilu klienta, sprawdza ich stronę i pisze mail dopasowany do ich działalności. Wysyła w godzinach roboczych, z naturalnymi przerwami. Klient widzi tylko odpowiedzi od zainteresowanych.",
            result: "15 maili dziennie, 465 wysłanych w miesiącu",
            duration: "Czas budowy: 8 tygodni",
            note: "Narzędzie dostępne dla klientów Nobelion w modelu abonamentowym."
        }
    ]
}

export const processData = {
    sectionLabel: "JAK PRACUJEMY",
    heading: "OD POMYSŁU DO SYSTEMU",
    subheading: "Cztery kroki. Bez handlowców, bez prezentacji, bez ukrytych kosztów. Brief jest darmowy i do niczego nie zobowiązuje.",
    steps: [
        {
            id: "01",
            duration: "2 minuty",
            title: "ZGŁASZASZ POMYSŁ",
            body: "Wypełniasz krótki brief. Pytamy o to, co zjada Twój czas. Nie potrzebujesz znać rozwiązania, my je zaproponujemy.",
            clientSide: "Opisujesz problem własnymi słowami. Określasz pilność i orientacyjne ramy.",
            ourSide: "Otrzymujemy zgłoszenie natychmiast. Zaczynamy analizę."
        },
        {
            id: "02",
            duration: "24 do 48 godzin",
            title: "DOSTAJESZ PLAN I WYCENĘ",
            body: "Po analizie wysyłamy plan działania, harmonogram, dokładną wycenę. Konkret, bez gwiazdek i ukrytych kosztów.",
            clientSide: "Czytasz, pytasz, ewentualnie negocjujesz zakres.",
            ourSide: "Przygotowujemy plan wdrożenia, dobieramy technologie, zabezpieczamy zasoby."
        },
        {
            id: "03",
            duration: "Jeden klik",
            title: "AKCEPTUJESZ I PŁACISZ",
            body: "Dostajesz mailem bezpieczny link do płatności. Płacisz kartą, BLIKiem lub przelewem. Faktura wystawiana automatycznie.",
            clientSide: "Klikasz, płacisz, dostajesz potwierdzenie i fakturę.",
            ourSide: "Dostajemy powiadomienie, zaczynamy pracę."
        },
        {
            id: "04",
            duration: "2 do 6 tygodni",
            title: "URUCHAMIAMY SYSTEM",
            body: "Budujemy, testujemy, wdrażamy. Codziennie wiesz, co się dzieje. Po uruchomieniu szkolimy zespół, hostujemy i utrzymujemy.",
            clientSide: "Dostajesz dostęp do działającego systemu i instrukcji.",
            ourSide: "Wdrażamy, monitorujemy, odpowiadamy na pytania, rozwijamy."
        }
    ]
}

export const audienceData = {
    sectionLabel: "DLA KOGO",
    heading: "JEŚLI JESTEŚ Z...",
    subheading: "Pracujemy z polskimi firmami, niezależnie od branży. Poniżej najczęstsze obszary, w których przynosimy konkretne efekty.",
    segments: [
        {
            number: "01",
            name: "E-COMMERCE",
            typical: "Synchronizacja zamówień, monitorowanie cen konkurencji, generatory opisów, automatyczne maile po zakupie, panele dla obsługi klienta."
        },
        {
            number: "02",
            name: "BIURA KSIĘGOWE I PRAWNE",
            typical: "Kategoryzacja faktur, generowanie JPK, automatyzacja powtarzalnej korespondencji, panele klientów, alerty o zmianach prawa."
        },
        {
            number: "03",
            name: "AGENCJE MARKETINGOWE",
            typical: "Generatory treści, raporty kampanii, automatyzacja onboardingu klientów, integracje narzędzi reklamowych, dashboardy danych."
        },
        {
            number: "04",
            name: "SPRZEDAŻ B2B",
            typical: "Cold outreach z personalizacją, scoring leadów, follow-up po spotkaniach, integracje CRM, generatory ofert."
        },
        {
            number: "05",
            name: "PRODUKCJA I HURT",
            typical: "Zarządzanie magazynem, zamówienia od kontrahentów, raporty produkcyjne, integracje z systemami logistycznymi."
        },
        {
            number: "06",
            name: "USŁUGI LOKALNE",
            typical: "Rezerwacje online, przypomnienia SMS, panele klienta, automatyczne ankiety satysfakcji, system lojalnościowy."
        }
    ],
    closing: "Nie widzisz swojej branży? Brief jest otwarty dla każdego."
}

export const benefitsData = {
    sectionLabel: "CO ZYSKASZ",
    heading: "BEZ SYSTEMU. Z SYSTEMEM.",
    subheading: "Cztery wymiary, w których automatyzacja zmienia codzienną pracę firmy.",
    items: [
        {
            title: "CZAS",
            before: "Zespół spędza godziny na powtarzalnych zadaniach.",
            after: "Te godziny wracają do firmy. Wracają do strategii i klientów."
        },
        {
            title: "PIENIĄDZE",
            before: "Każda godzina pracy ma koszt. Powtarzalna praca, koszt powtarzalny.",
            after: "Inwestycja jednorazowa. Praca wykonywana 24 godziny na dobę, bez nadgodzin."
        },
        {
            title: "SKALA",
            before: "Wzrost firmy oznacza wzrost zatrudnienia. Lub chaos w procesach.",
            after: "Skalujesz biznes bez skalowania zespołu. Procesy rosną automatycznie."
        },
        {
            title: "SPOKÓJ",
            before: "Wieczorne maile. Weekendowe raporty. Ciągłe gaszenie pożarów.",
            after: "Procesy działają same. Ty robisz to, co naprawdę wymaga człowieka."
        }
    ]
}

export const statsData = [
    {
        value: 240,
        prefix: "",
        suffix: " 000 zł",
        label: "SPRZEDAŻY DLA JEDNEGO KLIENTA W 9 MIESIĘCY"
    },
    {
        value: 24,
        prefix: "",
        suffix: "x",
        label: "SZYBCIEJ NIŻ PRACA RĘCZNA W OSTATNIM PROJEKCIE"
    },
    {
        value: 100,
        prefix: "",
        suffix: "%",
        label: "POLSKI KAPITAŁ I WŁASNY ZESPÓŁ"
    }
]

export const faqData = [
    {
        question: "ILE CZASU TRWA WDROŻENIE AUTOMATYZACJI?",
        answer: "Najczęściej od dwóch do sześciu tygodni, w zależności od skali. Proste integracje uruchamiamy w ciągu kilku dni. Większe systemy budujemy etapami, żeby pierwsza wartość trafiła do firmy jak najszybciej. Dokładny harmonogram zawsze jest częścią wyceny."
    },
    {
        question: "CZY MUSZĘ ZNAĆ SIĘ NA TECHNOLOGII?",
        answer: "Nie. Naszą rolą jest tłumaczenie złożonych spraw na zwykły język. Brief jest po polsku, plan jest po polsku, faktury są po polsku. Wystarczy, że wiesz, co Cię uwiera. Resztą zajmujemy się my."
    },
    {
        question: "CO SIĘ DZIEJE PO URUCHOMIENIU SYSTEMU? KTO GO UTRZYMUJE?",
        answer: "Hostujemy i utrzymujemy systemy na własnej infrastrukturze. Monitoring, aktualizacje, wsparcie techniczne, drobne zmiany. Wszystko w ramach miesięcznego abonamentu, którego wysokość zależy od skali. Nie zostajesz sam z działającym kodem."
    },
    {
        question: "JAK WYGLĄDA WYCENA? CZY MAJĄ PAŃSTWO CENNIK?",
        answer: "Każdy projekt jest inny, dlatego wycena jest zawsze indywidualna. Po wypełnieniu briefu, w ciągu 24 do 48 godzin, otrzymują Państwo plan działania i konkretną kwotę. Bez gwiazdek, bez ukrytych kosztów. Brief nie zobowiązuje do niczego."
    },
    {
        question: "CO JEŚLI MOJE NARZĘDZIA NIE MAJĄ INTEGRACJI?",
        answer: "Większość systemów udostępnia jakąś formę połączenia, nawet jeśli nie wprost. Jeśli oficjalnej integracji nie ma, zazwyczaj da się ją zbudować. To, co innym wydaje się ślepą uliczką, dla nas jest standardem pracy."
    },
    {
        question: "CZY DANE MOJEJ FIRMY SĄ BEZPIECZNE?",
        answer: "Tak. Pracujemy zgodnie z RODO. Dane przechowywane są na infrastrukturze w Unii Europejskiej, szyfrowane w spoczynku i w transmisji. Każdy projekt obejmuje umowę powierzenia danych. Bezpieczeństwo nie jest dodatkiem, jest fundamentem."
    }
]

export const briefCta = {
    sectionLabel: "START",
    heading: "POROZMAWIAJMY O TWOIM PROBLEMIE",
    subheading: "Bez prezentacji handlowej. Bez dzwonków. Krótki brief, konkretna wycena w ciągu 24 godzin.",
    primaryLabel: "WYPEŁNIJ BRIEF, 2 MIN",
    trustLine: "Średni czas wypełnienia: 2 minuty 14 sekund.",
    trustIndicators: ["BEZ ZOBOWIĄZAŃ", "WYCENA W 24H", "BEZPIECZNE PŁATNOŚCI"]
}

export const contactData = {
    cta: "MAIL BEZPOŚREDNI",
    subCta: "Wolisz krótko i konkretnie?",
    buttonLabel: "kontakt@nobelion.pl",
    companyName: "NOBELION SP. Z O.O.",
    details: [
        { label: "ADRES", value: "Ul. Pamiątkowa 2, 61-512 Poznań" },
        { label: "NIP", value: "783-189-80-94" },
        { label: "REGON", value: "527810001" },
        { label: "KRS", value: "0001088524" },
        { label: "EMAIL", value: "kontakt@nobelion.pl" }
    ]
}

// Stare dane zachowane do kompatybilności wstecznej (używane przez Foundation/Divisions
// jeśli któraś sekcja jeszcze nie została zmigrowana). Bezpiecznie usunąć po pełnej migracji.
export const bentoGridItems = servicesData.pillars.map((pillar, idx) => ({
    id: idx + 1,
    title: pillar.name,
    description: pillar.lead,
    icon: ["lightning", "globe", "diamond", "shield", "crown", "user"][idx % 6],
    colSpan: "md:col-span-1"
}))

export const divisionsData = processData.steps.map(step => ({
    id: step.id,
    title: step.title,
    description: step.body
}))

// Treści prawne. Struktura zachowana, treść zaktualizowana pod nowy profil
// działalności (automatyzacje AI i oprogramowanie na zamówienie).

export const legalContent = {
    privacy: {
        title: "POLITYKA PRYWATNOŚCI",
        date: "OSTATNIA AKTUALIZACJA: 28.04.2026",
        sections: [
            {
                heading: "I. ADMINISTRATOR DANYCH",
                content: "Administratorem danych osobowych jest NOBELION SP. Z O.O. z siedzibą w Poznaniu, ul. Pamiątkowa 2, 61-512 Poznań, wpisana do rejestru przedsiębiorców pod numerem KRS: 0001088524, NIP: 7831898094. Ochrona danych osobowych jest dla nas priorytetem operacyjnym i fundamentem zaufania klientów."
            },
            {
                heading: "II. ZAKRES PRZETWARZANIA",
                content: "Przetwarzamy dane niezbędne do realizacji zleceń projektowych, świadczenia usług automatyzacji AI, tworzenia oprogramowania na zamówienie, prowadzenia korespondencji handlowej oraz wystawiania dokumentów księgowych. Dane przechowujemy na infrastrukturze w Unii Europejskiej, szyfrowane w spoczynku oraz w transmisji."
            },
            {
                heading: "III. PLIKI COOKIES I ANALITYKA",
                content: "Strona wykorzystuje pliki cookies w celu optymalizacji doświadczeń użytkownika oraz analizy ruchu. Masz prawo do zarządzania ustawieniami prywatności z poziomu przeglądarki."
            },
            {
                heading: "IV. PRAWA UŻYTKOWNIKA",
                content: "Przysługuje Ci prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. W sprawach związanych z ochroną danych skontaktuj się z nami pod adresem kontakt@nobelion.pl."
            }
        ]
    },
    terms: {
        title: "REGULAMIN ŚWIADCZENIA USŁUG",
        date: "WERSJA 3.0 / 2026",
        sections: [
            {
                heading: "I. POSTANOWIENIA OGÓLNE",
                content: "Niniejszy regulamin określa zasady korzystania z serwisu nobelion.pl oraz świadczenia usług projektowania automatyzacji AI, tworzenia stron internetowych i oprogramowania na zamówienie przez NOBELION SP. Z O.O."
            },
            {
                heading: "II. ZAKRES USŁUG",
                content: "Usługodawca świadczy usługi w trzech głównych obszarach: automatyzacje procesów biznesowych z wykorzystaniem AI, projektowanie i wdrażanie stron internetowych oraz aplikacji webowych, tworzenie oprogramowania szytego na miarę. Każde wdrożenie poprzedza brief i pisemna wycena."
            },
            {
                heading: "III. PROCES WSPÓŁPRACY",
                content: "Współpraca rozpoczyna się od wypełnienia formularza zgłoszeniowego (briefu). W ciągu 24 do 48 godzin roboczych Klient otrzymuje plan działania i wycenę. Akceptacja wyceny i opłacenie pierwszej transzy są warunkiem rozpoczęcia prac wdrożeniowych."
            },
            {
                heading: "IV. PRAWA AUTORSKIE",
                content: "Materiały wizualne, kod źródłowy, logotypy oraz architektura informacji serwisu nobelion.pl są własnością intelektualną NOBELION SP. Z O.O. Prawa do oprogramowania zamówionego przez Klienta przekazywane są zgodnie z postanowieniami umowy projektowej."
            }
        ]
    },
    rodo: {
        title: "KLAUZULA INFORMACYJNA RODO",
        date: "ZGODNOŚĆ Z ROZPORZĄDZENIEM UE 2016/679",
        sections: [
            {
                heading: "I. PRAWA UŻYTKOWNIKA",
                content: "Zgodnie z art. 13 RODO informujemy, że przysługuje Ci prawo do dostępu do swoich danych, ich sprostowania, usunięcia (prawo do bycia zapomnianym), ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu."
            },
            {
                heading: "II. PODSTAWA PRAWNA PRZETWARZANIA",
                content: "Dane przetwarzane są na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy) oraz lit. f RODO (uzasadniony interes administratora) w zakresie korespondencji handlowej i marketingu bezpośredniego usług własnych."
            },
            {
                heading: "III. KONTAKT",
                content: "W sprawach ochrony danych osobowych skontaktuj się z nami pod adresem kontakt@nobelion.pl. Odpowiadamy w terminie do 30 dni."
            }
        ]
    }
};
