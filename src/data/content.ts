// src/data/content.ts

export const siteConfig = {
    title: "NOBELION | The Onyx Edition",
    description: "Budowanie i skalowanie globalnych marek Direct-to-Consumer.",
    email: "contact@nobelion.com"
}

export const heroData = {
    heading: "NOBELION",
    subheading: "ARCHITEKCI HANDLU", // Krótko, mocno, po polsku
    scrollText: "EKSPLORACJA SYSTEMU" // Techniczne określenie
}

// Nawigacja - Czysta, jednowyrazowa, korporacyjna
export const navigation = [
    { label: "FUNDAMENT", href: "#foundation" },
    { label: "SKALA", href: "#proof" },
    { label: "DYWIZJE", href: "#divisions" },
    { label: "DANE", href: "#vault" }
]

// Bento Grid - Atuty Wewnętrzne Firmy
export const bentoGridItems = [
    {
        id: 1,
        title: "ANALIZA RYNKU",
        description: "Weryfikujemy potencjał produktów w czasie rzeczywistym. Wprowadzamy na rynek tylko matematycznie potwierdzonych zwycięzców.",
        icon: "lightning",
        colSpan: "md:col-span-1",
    },
    {
        id: 2,
        title: "IMPORT BEZPOŚREDNI",
        description: "Własna sieć dostawców i kontrola jakości u źródła. Eliminujemy pośredników, maksymalizujemy marżę.",
        icon: "globe",
        colSpan: "md:col-span-1",
    },
    {
        id: 3,
        title: "PŁYNNOŚĆ",
        description: "Niezależność finansowa pozwalająca na natychmiastowe skalowanie zatowarowania przy pikach sprzedażowych.",
        icon: "diamond",
        colSpan: "md:col-span-1", 
    },
    {
        id: 4,
        title: "DYSTRYBUCJA",
        description: "Własne centra logistyczne i zoptymalizowane procesy 'ostatniej mili'.",
        icon: "shield",
        colSpan: "md:col-span-1",
    },
    {
        id: 5,
        title: "BRANDING",
        description: "Tworzymy marki, które budują lojalność i emocjonalną więź z klientem końcowym.",
        icon: "crown",
        colSpan: "md:col-span-1",
    },
    {
        id: 6,
        title: "KADRA",
        description: "Eksperci e-commerce, marketingu efektywnościowego i logistyki pod jednym dachem.",
        icon: "user",
        colSpan: "md:col-span-1",
    }
];

export const statsData = [
    {
        value: 50,
        suffix: "k+",
        label: "ZREALIZOWANYCH ZAMÓWIEŃ"
    },
    {
        value: 3,
        suffix: "",
        label: "KONTYNENTY DYSTRYBUCJI"
    },
    {
        value: 100,
        prefix: "",
        suffix: "%",
        label: "POLSKI KAPITAŁ"
    }
];

// Dywizje - Struktura Holdingu
export const divisionsData = [
    {
        id: "01",
        title: "MARKI WŁASNE (DTC)",
        description: "Nasz główny filar. Projektujemy, wdrażamy i skalujemy brandy w modelu Direct-to-Consumer. Pełna kontrola od produkcji do drzwi klienta."
    },
    {
        id: "02",
        title: "WALIDACJA RYNKOWA",
        description: "Zaawansowany proces weryfikacji popytu przed alokacją kapitału w towar. Decyzje zakupowe opieramy na twardych danych, eliminując ryzyko."
    },
    {
        id: "03",
        title: "KANAŁ HURTOWY (B2B)",
        description: "Dedykowana oferta dla partnerów biznesowych i sieci handlowych. Udostępniamy naszą infrastrukturę oraz zweryfikowane bestsellery."
    },
    {
        id: "04",
        title: "ŁAŃCUCH DOSTAW",
        description: "Wewnętrzna dywizja operacyjna. Obsługa importu, magazynowanie wysokiego składowania oraz optymalizacja procesów logistycznych."
    }
];

export const contactData = {
    cta: "DANE REJESTROWE",
    subCta: "Informacje prawne podmiotu.",
    buttonLabel: "WYŚLIJ ZAPYTANIE",
    companyName: "NOBELION SP. Z O.O.",
    details: [
        { label: "ADRES", value: "Ul. Pamiątkowa 2, 61-512 Poznań" },
        { label: "NIP", value: "783-189-80-94" },
        { label: "REGON", value: "527810001" },
        { label: "KRS", value: "0001088524" },
        { label: "EMAIL", value: "kontakt@nobelion.pl" }
    ]
};

export const faqData = [
    {
        question: "CZY NOBELION JEST OTWARTY NA INWESTORÓW ZEWNĘTRZNYCH?",
        answer: "Aktualnie operujemy wyłącznie na kapitale własnym, co zapewnia nam pełną niezależność decyzyjną. Jesteśmy jednak otwarci na rozmowy o strategicznych partnerstwach typu Joint Venture przy ekspansji na rynki azjatyckie."
    },
    {
        question: "CZY WSPÓŁPRACUJECIE Z MNIEJSZYMI PODMIOTAMI E-COMMERCE?",
        answer: "Nasza infrastruktura jest zoptymalizowana pod procesy wysokonakładowe. W kanale B2B (Hurt) minimalne zamówienie (MOQ) jest ustalane indywidualnie, zazwyczaj zaczynając się od paletyzowanych jednostek logistycznych."
    },
    {
        question: "JAK WYGLĄDA PROCES WALIDACJI RYNKOWEJ PRODUKTU?",
        answer: "Wykorzystujemy autorskie algorytmy analityczne oraz testy A/B na żywym ruchu (Paid Social / Google Ads). Decyzja o zatowarowaniu zapada dopiero po osiągnięciu określonego wskaźnika ROAS i konwersji w fazie testowej."
    },
    {
        question: "CZY OFERUJECIE USŁUGI LOGISTYCZNE (3PL) DLA FIRM TRZECICH?",
        answer: "Nie jesteśmy operatorem logistycznym dla rynku otwartego. Nasz łańcuch dostaw i magazyny służą wyłącznie do obsługi marek należących do Holdingu oraz naszych kluczowych partnerów dystrybucyjnych."
    }
];

//Dane do regulaminóœ i polityk prywatności

export const legalContent = {
    privacy: {
        title: "POLITYKA PRYWATNOŚCI",
        date: "OSTATNIA AKTUALIZACJA: 28.11.2025",
        sections: [
            {
                heading: "Postanowienia wstępne",
                content: "Administratorem danych osobowych jest NOBELION SP. Z O.O. z siedzibą w Warszawie, ul. Złota 44, wpisana do rejestru przedsiębiorców pod numerem KRS: 0000123456. Ochrona Twoich danych to dla nas priorytet operacyjny."
            },
            {
                heading: "II. ZAKRES PRZETWARZANIA",
                content: "Przetwarzamy dane niezbędne do realizacji procesów logistycznych, handlowych oraz marketingowych (w tym Newsletter). Dane są szyfrowane i przechowywane na serwerach spełniających normy ISO 27001."
            },
            {
                heading: "III. PLIKI COOKIES I ANALITYKA",
                content: "Strona wykorzystuje pliki cookies w celu optymalizacji doświadczeń użytkownika oraz analizy ruchu (Google Analytics 4). Masz prawo do zarządzania ustawieniami prywatności z poziomu przeglądarki."
            }
            // ... Tutaj wklej resztę swoich punktów
        ]
    },
    terms: {
        title: "REGULAMIN SERWISU",
        date: "WERSJA 2.0 / 2025",
        sections: [
            {
                heading: "I. POSTANOWIENIA OGÓLNE",
                content: "Niniejszy regulamin określa zasady korzystania z infrastruktury cyfrowej NOBELION. Wejście na stronę oznacza akceptację poniższych warunków."
            },
            {
                heading: "II. PRAWA AUTORSKIE",
                content: "Wszelkie materiały wizualne, kod źródłowy, logotypy oraz architektura informacji są własnością intelektualną NOBELION SP. Z O.O. Kopiowanie bez zgody zarządu jest zabronione."
            }
            // ... Tutaj wklej resztę
        ]
    },
    rodo: {
        title: "KLAUZULA INFORMACYJNA RODO",
        date: "ZGODNOŚĆ Z ROZPORZĄDZENIEM UE",
        sections: [
            {
                heading: "PRAWA UŻYTKOWNIKA",
                content: "Zgodnie z art. 13 RODO informujemy, że przysługuje Ci prawo do: dostępu do swoich danych, ich sprostowania, usunięcia ('prawo do bycia zapomnianym'), ograniczenia przetwarzania oraz wniesienia sprzeciwu."
            },
            {
                heading: "KONTAKT Z IOD",
                content: "W sprawach ochrony danych osobowych skontaktuj się z naszym Inspektorem Ochrony Danych pod adresem: legal@nobelion.com."
            }
            // ... Tutaj wklej resztę
        ]
    }
};