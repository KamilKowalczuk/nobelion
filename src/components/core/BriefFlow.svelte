<script lang="ts">
  import { onMount, tick } from "svelte";
  import { slide } from "svelte/transition";

  type Diagnosis = "biuro" | "strona" | "sprzedaz" | "wizja" | null;

  let step = $state(1);
  let maxStep = $state(1);
  const TOTAL = 7;
  
  let isSubmitting = $state(false);
  let submitState = $state<"idle" | "success" | "error">("idle");
  let submitError = $state("");
  let placeholderIndex = $state(0);
  let shake = $state(false);
  let shellEl = $state<HTMLElement | null>(null);
  let mainEl = $state<HTMLElement | null>(null);
  let qEl = $state<HTMLElement | null>(null);
  let shellMinHeight = $state(0);
  let mainMinHeight = $state(820);

  let f = $state({
    diagnosis: null as Diagnosis,
    industry: "",
    size: "",
    laborRate: "mid",
    tools: "",
    problem: "",
    helperOpen: false,
    helperAnswers: {
      frequency: "",
      people: "",
      time: "",
      tools: "",
      tried: "",
    },
    hoursWeek: 5,
    peopleInvolved: "",
    growsWithScale: "",
    triedBefore: [] as string[],
    triedNotes: "",
    urgency: "",
    scope: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    nip: "",
    agreedPrivacy: false,
    agreedTerms: false,
    honeypot: "",
  });

  type BriefAttachment = {
    id: string;
    file: File;
  };

  const MAX_ATTACHMENTS = 5;
  const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
  let attachments = $state<BriefAttachment[]>([]);
  let attachmentError = $state("");

  // ── Walidacja na żywo (krok 7) ──
  let touched = $state({ name: false, email: false, phone: false, company: false, nip: false });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Filtry znaków — niedozwolone znaki nie wchodzą do pola w ogóle.
  const NAME_CHARS = /^[\p{L}\s'.\-]+$/u;
  const PHONE_CHARS = /^[\d+()\s-]+$/;
  const NIP_CHARS = /^[0-9A-Za-z\s-]+$/; // litery dozwolone (prefiks kraju UE, np. PL/DE)

  const sanitizeName = (v: string) => v.replace(/[^\p{L}\s'.\-]/gu, "");
  const sanitizePhone = (v: string) => v.replace(/[^\d+()\s-]/g, "");
  const sanitizeNip = (v: string) => v.replace(/[^0-9A-Za-z\s-]/g, "").toUpperCase();

  // Warstwa 1: beforeinput odrzuca niedozwolony znak ZANIM trafi do pola.
  const blockChars = (allowed: RegExp) => (e: InputEvent) => {
    if (e.data && !allowed.test(e.data)) e.preventDefault();
  };

  // Warstwa 2 (wklejanie, autouzupełnianie): czyścimy DOM imperatywnie,
  // bo gdy stan po sanitizacji się nie zmienia, Svelte nie odświeży inputa.
  function applySanitized(el: HTMLInputElement, clean: string) {
    if (el.value === clean) return;
    const diff = el.value.length - clean.length;
    const pos = (el.selectionStart ?? clean.length) - diff;
    el.value = clean;
    const p = Math.max(0, Math.min(clean.length, pos));
    el.setSelectionRange(p, p);
  }

  function plNipChecksum(digits: string): boolean {
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
    return sum % 11 === Number(digits[9]);
  }

  // Prefiksy VAT UE (+ XI: Irlandia Płn., GB: legacy).
  const EU_VAT_PREFIXES = new Set(["AT","BE","BG","CY","CZ","DE","DK","EE","EL","ES","FI","FR","HR","HU","IE","IT","LT","LU","LV","MT","NL","PL","PT","RO","SE","SI","SK","XI","GB"]);

  function isNipValid(raw: string): boolean {
    const v = raw.replace(/[\s-]/g, "").toUpperCase();
    if (/^\d{10}$/.test(v)) return plNipChecksum(v);            // polski NIP — suma kontrolna
    if (/^PL\d{10}$/.test(v)) return plNipChecksum(v.slice(2)); // PL + 10 cyfr — też liczymy
    // Inne kraje UE: realny prefiks + 2–12 znaków, w tym co najmniej jedna cyfra.
    return /^[A-Z]{2}(?=[0-9A-Z]*\d)[0-9A-Z]{2,12}$/.test(v) && EU_VAT_PREFIXES.has(v.slice(0, 2));
  }

  const errors = $derived.by(() => {
    const e = { name: "", email: "", phone: "", company: "", nip: "" };
    if (f.name.trim().length < 2) e.name = "Podaj imię i nazwisko (min. 2 znaki).";
    if (!EMAIL_RE.test(f.email.trim())) e.email = "Podaj poprawny adres e-mail, np. jan@firma.pl.";
    const phoneDigits = f.phone.replace(/\D/g, "");
    if (f.phone.trim() !== "" && (phoneDigits.length < 9 || phoneDigits.length > 15)) {
      e.phone = "Numer telefonu powinien mieć 9–15 cyfr.";
    }
    if (f.company.trim().length < 2) e.company = "Podaj nazwę firmy (min. 2 znaki).";
    if (f.nip.trim() !== "" && !isNipValid(f.nip)) e.nip = "Niepoprawny NIP — 10 cyfr lub prefiks kraju (np. PL7831898094).";
    return e;
  });

  const contactValid = $derived(
    !errors.name && !errors.email && !errors.phone && !errors.company && !errors.nip
  );

  const placeholders = [
    "Mój zespół codziennie kopiuje dane z maila do Excela, zajmuje to 2 godziny dziennie...",
    "Klienci pytają o cennik mailowo, odpisuję ręcznie, czasem 30 maili dziennie...",
    "Mam listę 5000 firm i chciałbym, żeby coś automatycznie wysyłało spersonalizowane maile..."
  ];

  onMount(() => {
    const t = setInterval(() => placeholderIndex = (placeholderIndex + 1) % placeholders.length, 4500);
    const ro = new ResizeObserver(() => {
      void updateMainMinHeight();
      void updateShellMinHeight();
    });
    if (qEl) ro.observe(qEl);
    if (mainEl) ro.observe(mainEl);
    if (shellEl) ro.observe(shellEl);
    const onResize = () => {
      void updateMainMinHeight();
      void updateShellMinHeight();
    };
    window.addEventListener("resize", onResize);
    void updateMainMinHeight(true);
    void updateShellMinHeight(true);
    return () => {
      clearInterval(t);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  });

  const peopleMult = (v: string) => ({ "1":1, "2-3":2.5, "4-10":7, "10+":15 }[v] || 0);
  const laborRateOpts = [
    { v:"low", l:"Niski", d:"31,40 zł / h" },
    { v:"mid", l:"Średni", d:"50 zł / h" },
    { v:"high", l:"Wysoki", d:"100 zł / h" }
  ];
  const laborRateMap: Record<string, number> = { low: 31.4, mid: 50, high: 100 };
  const laborRateLabel = $derived((laborRateOpts.find(r => r.v === f.laborRate) || laborRateOpts[1]).d);
  const annualCost = $derived((f.hoursWeek > 0 && f.peopleInvolved) ? Math.round(f.hoursWeek * peopleMult(f.peopleInvolved) * laborRateMap[f.laborRate] * 52) : 0);
  const fmt = (n: number) => new Intl.NumberFormat("pl-PL").format(n);

  function canProceed(s: number): boolean {
    switch (s) {
      case 1: return f.diagnosis !== null;
      case 2: return f.industry !== "" && f.size !== "";
      case 3: return f.problem.trim().length >= 30;
      case 4: return f.peopleInvolved !== "" && f.growsWithScale !== "";
      case 5: return true;
      case 6: return f.urgency !== "" && f.scope !== "";
      case 7: return contactValid && f.agreedPrivacy && f.agreedTerms && f.honeypot === "";
      default: return false;
    }
  }

  // Krótka podpowiedź przy nieaktywnym przycisku — co jeszcze trzeba uzupełnić.
  const stepHint = $derived.by(() => {
    if (canProceed(step)) return "";
    switch (step) {
      case 1: return "Wybierz jedną z opcji";
      case 2: {
        const m = [];
        if (!f.industry) m.push("branżę");
        if (!f.size) m.push("wielkość zespołu");
        return "Wybierz " + m.join(" i ");
      }
      case 3: return `Opis problemu: min. 30 znaków (masz ${f.problem.trim().length})`;
      case 4: {
        const m = [];
        if (!f.peopleInvolved) m.push("liczbę osób");
        if (!f.growsWithScale) m.push("czy problem rośnie");
        return "Zaznacz " + m.join(" i ");
      }
      case 6: {
        const m = [];
        if (!f.urgency) m.push("pilność");
        if (!f.scope) m.push("zakres");
        return "Wybierz " + m.join(" i ");
      }
      case 7: {
        const m = [];
        if (errors.name) m.push("imię i nazwisko");
        if (errors.email) m.push("e-mail");
        if (errors.phone) m.push("telefon");
        if (errors.company) m.push("nazwę firmy");
        if (errors.nip) m.push("NIP");
        if (!f.agreedPrivacy || !f.agreedTerms) m.push("zgody");
        return m.length ? "Uzupełnij: " + m.join(", ") : "";
      }
      default: return "";
    }
  });

  function doShake() { shake = true; setTimeout(() => shake = false, 420); }

  async function updateMainMinHeight(force = false) {
    await tick();
    if (!mainEl || !qEl) return;
    const nav = mainEl.querySelector(".nb-brief__nav") as HTMLElement | null;
    const progress = mainEl.querySelector(".nb-brief__progress") as HTMLElement | null;
    const qStyles = window.getComputedStyle(qEl);
    const qTop = parseFloat(qStyles.marginTop || "0") || 0;
    const qBottom = parseFloat(qStyles.marginBottom || "0") || 0;
    const navMarginTop = nav ? (parseFloat(window.getComputedStyle(nav).marginTop || "0") || 0) : 0;
    const progressH = progress ? progress.offsetHeight : 0;
    const qH = qEl.offsetHeight;
    const navH = nav ? nav.offsetHeight : 0;
    const total = Math.ceil(progressH + qTop + qH + qBottom + navMarginTop + navH);
    if (force) {
      mainMinHeight = total;
      return;
    }
    mainMinHeight = Math.max(mainMinHeight, total);
  }

  async function updateShellMinHeight(force = false) {
    await tick();
    if (!shellEl) return;
    if (window.innerWidth < 860) {
      shellMinHeight = 0;
      return;
    }
    const total = shellEl.offsetHeight;
    if (force) {
      shellMinHeight = total;
      return;
    }
    if (total > shellMinHeight) {
      shellMinHeight = total;
    }
  }

  async function goto(s: number) {
    if (s < 1 || s > TOTAL) return;
    if (s > step && !canProceed(step)) { doShake(); return; }
    step = s; maxStep = Math.max(maxStep, s);
    if (window.innerWidth >= 860) {
      await updateMainMinHeight();
      await updateShellMinHeight();
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function onAttachmentChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files || []);
    attachmentError = "";
    if (files.length === 0) return;

    const next = [...attachments];
    for (const file of files) {
      const isPdf = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");
      if (!isPdf && !isImage) {
        attachmentError = "Dozwolone są tylko pliki PDF oraz obrazy.";
        continue;
      }
      if (file.size > MAX_ATTACHMENT_SIZE) {
        attachmentError = "Każdy plik może mieć maksymalnie 10 MB.";
        continue;
      }
      if (next.length >= MAX_ATTACHMENTS) {
        attachmentError = "Maksymalnie możesz dodać 5 plików.";
        break;
      }
      next.push({ id: crypto.randomUUID(), file });
    }

    attachments = next;
    input.value = "";
  }

  function removeAttachment(id: string) {
    attachments = attachments.filter((a) => a.id !== id);
    attachmentError = "";
  }

  async function submit() {
    if (!canProceed(7)) { doShake(); return; }
    if (f.honeypot !== "") { submitState = "success"; return; }

    isSubmitting = true;
    submitError = "";
    try {
      const init: RequestInit = { method: "POST" };
      if (attachments.length > 0) {
        const formData = new FormData();
        formData.set("data", JSON.stringify(f));
        for (const attachment of attachments) {
          formData.append("attachments", attachment.file);
        }
        init.body = formData;
      } else {
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify(f);
      }
      const res = await fetch("/api/brief", init);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Nie udało się wysłać briefu.");
      submitState = "success";
    } catch (e) {
      submitError = e instanceof Error ? e.message : "Nie udało się wysłać briefu.";
      submitState = "error";
    } finally { isSubmitting = false; }
  }

  const STEPS = ["", "Diagnoza", "Kontekst", "Problem", "Skala", "Próby", "Ramy", "Kontakt"];
  const QHEAD: Record<number, [string, string]> = {
    1: ["Co dziś najbardziej spowalnia proces?", "Wybierz najbliższe Twojej sytuacji — doprecyzujemy później."],
    2: ["Poznajemy Twój świat", "Dzięki temu nie pytamy o oczywiste rzeczy później."],
    3: ["Własnym językiem, bez żargonu", "Im konkretniej, tym lepsza wycena. Pisz jak do kolegi."],
    4: ["Zmierzmy skalę problemu", "Liczymy, jaki ROI ma sens, zanim cokolwiek wdrożymy."],
    5: ["Nic nie oceniamy", "Wiedza o tym, co nie zadziałało, oszczędza tygodnie pracy."],
    6: ["Ustalmy oczekiwania", "Wycena zależy od zakresu i pilności. Powiedz szczerze."],
    7: ["Ostatni krok", "Odzywamy się w 24h robocze. Nie sprzedajemy — rozmawiamy, czy ma to sens."]
  };


  const diagnosis = [
    { id:"biuro", t:"Zespół traci czas na ręczne operacje", b:"kopiowanie danych, przepisywanie, raporty i poprawki" },
    { id:"strona", t:"Strona nie dowozi leadów lub sprzedaży", b:"ruch jest, ale brakuje zapytań i konwersji" },
    { id:"sprzedaz", t:"Sprzedaż działa zbyt wolno i nierówno", b:"prospecting, follow-up i domykanie zajmują za dużo czasu" },
    { id:"wizja", t:"Mam konkretny pomysł i chcę go wdrożyć", b:"potrzebuję partnera, który dowiezie od planu do działania" }
  ];
  const industries = ["E-commerce","Usługi B2B","Produkcja i hurt","Edukacja / e-learning","Biuro księgowe / prawne","Marketing / agencja","SaaS / aplikacja","Inne"];
  const sizes = ["1","2-10","11-50","50+"];
  const peopleOpts = ["1","2-3","4-10","10+"];
  const growsOpts = ["Tak","Nie","Nie wiem"];
  const triedOpts = ["Zatrudnić nową osobę","Inny software","Inna agencja","Coś w Excelu","Nic nie próbowaliśmy"];
  const urgencyOpts = [{v:"urgent",l:"Wczoraj, palące"},{v:"high",l:"W tym miesiącu"},{v:"medium",l:"W tym kwartale"},{v:"low",l:"Rozważam, brak deadline"}];
  const scopeOpts = [{v:"mvp",l:"Tylko MVP",d:"najszybciej, działa, koszt minimalny"},{v:"pelny",l:"Pełny system",d:"solidnie, długoterminowo"},{v:"doradzcie",l:"Nie wiem, doradźcie",d:"pomóżcie wybrać"}];
  const budgetOpts = ["< 5 000 zł","5 000 – 15 000 zł","15 000 – 50 000 zł","> 50 000 zł","Nie wiem, dopasujcie"];
  
  function toggleTried(v: string) { f.triedBefore = f.triedBefore.includes(v) ? f.triedBefore.filter(x=>x!==v) : [...f.triedBefore, v]; }

  const diagLabel = $derived(f.diagnosis ? (diagnosis.find(d=>d.id===f.diagnosis)||{}).t : null);
  const pct = $derived(Math.round(((step - 1) / (TOTAL - 1)) * 100));

  const dossier = $derived.by(() => {
    const d: [string, string][] = [];
    if (diagLabel) d.push(["Potrzeba", diagLabel]);
    if (f.industry) d.push(["Branża", f.industry]);
    if (f.size) d.push(["Zespół", f.size + " os."]);
    if (f.peopleInvolved) d.push(["Czas", f.hoursWeek + "h / tydz."]);
    if (f.urgency) d.push(["Pilność", (urgencyOpts.find(u=>u.v===f.urgency)||{l:""}).l]);
    return d;
  });
</script>

<div class="nb-brief__shell" bind:this={shellEl} style={shellMinHeight > 0 ? `min-height:${shellMinHeight}px` : undefined} class:nb-brief__shell--done={submitState === "success"}>
  {#if submitState === "success"}
    <div class="nb-brief__check">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">
        <path d="M5 12.5 L10 17.5 L19 6.5" />
      </svg>
    </div>
    <h3 class="h2 nb-brief__done-title">Mamy to.</h3>
    <p class="nb-brief__done-body">Twoje zgłoszenie do nas dotarło. Odzywamy się w ciągu <strong>24 godzin roboczych</strong>.</p>
    {#if f.email}<p class="caption nb-brief__done-mail">Podsumowanie wyślemy też na {f.email}</p>{/if}
  {:else}
    <!-- LEFT: dark progress + dossier rail -->
    <aside class="nb-brief__rail onyx">
      <div class="nb-brief__rail-top">
        <img src="/logo-icon.svg" alt="" class="nb-brief__rail-mark"/>
          <div>
            <div class="nb-brief__rail-name">Brief Nobelion</div>
            <div class="nb-brief__rail-sub mono">Wycena w 24h roboczych</div>
          </div>
      </div>

      <ol class="nb-brief__steps">
        {#each STEPS.slice(1) as label, idx}
          {@const n = idx + 1}
          {@const st = n === step ? "active" : n < step ? "done" : "next"}
          {@const reachable = n <= maxStep}
          <li class="nb-brief__step is-{st}" class:reach={reachable}>
            <button type="button" class="nb-brief__step-btn" disabled={!reachable} onclick={() => reachable && goto(n)}>
              <span class="nb-brief__step-mark">
                {#if n < step}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter">
                    <path d="M5 12.5 L10 17.5 L19 6.5" />
                  </svg>
                {:else}
                  {String(n).padStart(2,"0")}
                {/if}
              </span>
              <span class="nb-brief__step-label">{label}</span>
            </button>
          </li>
        {/each}
      </ol>

      <div class="nb-brief__dossier" class:is-empty={dossier.length === 0 && annualCost === 0}>
        <span class="caption nb-brief__dossier-h">Twój profil</span>
        {#if dossier.length === 0}
          <p class="nb-brief__dossier-empty">Podsumowanie uzupełni się automatycznie po pierwszych odpowiedziach.</p>
        {/if}
        {#each dossier as [k,v]}
          <div class="nb-brief__drow" transition:slide|local>
            <span class="nb-brief__dk mono">{k}</span>
            <span class="nb-brief__dv">{v}</span>
          </div>
        {/each}
        {#if annualCost > 0}
          <div class="nb-brief__roi" transition:slide|local>
            <span class="caption">Szac. koszt roczny problemu</span>
            <span class="nb-brief__roi-big">~ {fmt(annualCost)} zł</span>
            <span class="nb-brief__roi-note mono">przy {laborRateLabel} pracy</span>
          </div>
        {/if}
      </div>
    </aside>

    <!-- RIGHT: light focused Q&A -->
    <div class="nb-brief__main" bind:this={mainEl} style={`min-height:${mainMinHeight}px`}>
      <div class="nb-brief__progress">
        <div class="nb-brief__progress-meta">
          <span class="mono">Krok {String(step).padStart(2,"0")} — {STEPS[step]}</span>
          <span class="mono">{pct}%</span>
        </div>
        <div class="nb-brief__bar"><div class="nb-brief__bar-fill" style="width: {pct}%"></div></div>
      </div>

      <div class="nb-brief__q" bind:this={qEl} class:shake={shake}>
        <h3 class="nb-brief__q-title">{QHEAD[step][0]}</h3>
        <p class="nb-brief__q-sub">{QHEAD[step][1]}</p>

        <div class="nb-brief__fields">
          {#if step === 1}
            <div class="nb-stack">
              {#each diagnosis as o, i}
                <button type="button" class="nb-diag" class:sel={f.diagnosis === o.id} onclick={() => f.diagnosis = o.id as Diagnosis}>
                  <span class="nb-diag__n">{String(i+1).padStart(2,"0")}</span>
                  <span class="nb-diag__txt"><span class="nb-diag__t">{o.t}</span><span class="nb-diag__b">{o.b}</span></span>
                  <span class="nb-diag__check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">
                      <path d="M5 12.5 L10 17.5 L19 6.5" />
                    </svg>
                  </span>
                </button>
              {/each}
            </div>
          {:else if step === 2}
            <div class="nb-stack">
              <div class="nb-field">
                <span class="nb-field__label caption">Branża</span>
                <div class="nb-select">
                  <select bind:value={f.industry}>
                    <option value="">Wybierz branżę…</option>
                    {#each industries as x}<option value={x}>{x}</option>{/each}
                  </select>
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Wielkość zespołu</span>
                <div class="nb-pills nb-pills--4">
                  {#each sizes as s}<button type="button" class="nb-pill" class:sel={f.size===s} onclick={()=>f.size=s}>{s}</button>{/each}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Główne narzędzia (opcjonalnie)</span>
                <input class="nb-input" type="text" maxlength={200} bind:value={f.tools} placeholder="np. Gmail, Excel, Subiekt, Allegro, Salesforce…"/>
              </div>
            </div>
          {:else if step === 3}
            <div class="nb-stack">
              <div class="nb-field">
                <span class="nb-field__label caption">Opisz problem</span>
                <textarea class="nb-input nb-textarea" rows={6} maxlength={2000} bind:value={f.problem} placeholder={placeholders[placeholderIndex]}></textarea>
                <div class="nb-brief__meta">
                  <span class="mono" class:warn={f.problem.length<30}>{f.problem.length} znaków {f.problem.length<30?"(min. 30)":""}</span>
                  <button type="button" class="nb-link" onclick={()=>f.helperOpen = !f.helperOpen}>{f.helperOpen ? "— Ukryj pomoc" : "+ Pomóż mi opisać"}</button>
                </div>
              </div>
              {#if f.helperOpen}
                <div class="nb-helper" transition:slide|local>
                  <span class="caption nb-helper__h">Pomocnicze pytania</span>
                  {#each [["frequency","Jak często pojawia się ten problem?"],["people","Ile osób się tym zajmuje?"],["time","Ile czasu zajmuje za każdym razem?"],["tools","Jakich narzędzi używacie dziś?"],["tried","Co już próbowaliście?"]] as [k,q]}
                    <label class="nb-helper__row">
                      <span>{q}</span>
                      <input class="nb-input nb-input--sm" type="text" maxlength={200} bind:value={f.helperAnswers[k as keyof typeof f.helperAnswers]}/>
                    </label>
                  {/each}
                </div>
              {/if}
              <div class="nb-drop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
                    <path d="M12 5 V19 M5 12 H19" />
                </svg>
                <span class="caption">Opcjonalnie: dodaj screeny lub dokumenty</span>
                <span class="nb-drop__hint">do 5 plików · max 10 MB · JPG/PNG/WEBP/PDF</span>
                <label class="nb-drop__upload" for="brief-attachments">Wybierz pliki</label>
                <input id="brief-attachments" class="nb-drop__input" type="file" accept="image/*,application/pdf" multiple onchange={onAttachmentChange} />
                {#if attachments.length > 0}
                  <div class="nb-drop__list">
                    {#each attachments as attachment}
                      <div class="nb-drop__item">
                        <span class="nb-drop__name">{attachment.file.name}</span>
                        <span class="nb-drop__size">{formatFileSize(attachment.file.size)}</span>
                        <button type="button" class="nb-drop__remove" onclick={() => removeAttachment(attachment.id)}>Usuń</button>
                      </div>
                    {/each}
                  </div>
                {/if}
                {#if attachmentError}
                  <span class="nb-drop__error">{attachmentError}</span>
                {/if}
              </div>
            </div>
          {:else if step === 4}
            <div class="nb-stack">
              <div class="nb-field">
                <span class="nb-field__label caption">Ile godzin tygodniowo ten problem zjada Twojej firmie?</span>
                <div class="nb-slider-row">
                  <input class="nb-slider" type="range" min="0" max="80" step="1" bind:value={f.hoursWeek}/>
                  <span class="nb-slider__val">{f.hoursWeek}h</span>
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Ile osób się tym zajmuje?</span>
                <div class="nb-pills nb-pills--4">
                  {#each peopleOpts as p}<button type="button" class="nb-pill" class:sel={f.peopleInvolved===p} onclick={()=>f.peopleInvolved=p}>{p}</button>{/each}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Szacowany koszt 1 roboczogodziny</span>
                <div class="nb-pills nb-pills--3">
                  {#each laborRateOpts as r}
                    <button type="button" class="nb-pill" class:sel={f.laborRate===r.v} onclick={()=>f.laborRate=r.v}>{r.l} · {r.d}</button>
                  {/each}
                </div>
                <span class="nb-field__hint">Niski: ustawowe minimum 2026 (31,40 zł/h)</span>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Czy problem rośnie ze skalą firmy?</span>
                <div class="nb-pills nb-pills--3">
                  {#each growsOpts as g}<button type="button" class="nb-pill" class:sel={f.growsWithScale===g} onclick={()=>f.growsWithScale=g}>{g}</button>{/each}
                </div>
              </div>
            </div>
          {:else if step === 5}
            <div class="nb-stack">
              <div class="nb-field">
                <span class="nb-field__label caption">Próbowaliście:</span>
                <div class="nb-checks">
                  {#each triedOpts as t}
                    <label class="nb-check" class:sel={f.triedBefore.includes(t)}>
                      <input type="checkbox" checked={f.triedBefore.includes(t)} onchange={()=>toggleTried(t)}/>
                      <span class="nb-check__box">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
                          <path d="M5 12.5 L10 17.5 L19 6.5" />
                        </svg>
                      </span>
                      <span>{t}</span>
                    </label>
                  {/each}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Co nie zadziałało? (opcjonalnie)</span>
                <textarea class="nb-input nb-textarea" rows={4} maxlength={2000} bind:value={f.triedNotes} placeholder="Dlaczego dotychczasowe próby nie wyszły…"></textarea>
              </div>
            </div>
          {:else if step === 6}
            <div class="nb-stack">
              <div class="nb-field">
                <span class="nb-field__label caption">Pilność</span>
                <div class="nb-pills nb-pills--2">
                  {#each urgencyOpts as u}<button type="button" class="nb-pill nb-pill--wide" class:sel={f.urgency===u.v} onclick={()=>f.urgency=u.v}>{u.l}</button>{/each}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Zakres</span>
                <div class="nb-stack nb-stack--sm">
                  {#each scopeOpts as s}
                    <button type="button" class="nb-scope" class:sel={f.scope===s.v} onclick={()=>f.scope=s.v}>
                      <span class="nb-scope__l">{s.l}</span>
                      <span class="nb-scope__d">{s.d}</span>
                    </button>
                  {/each}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">Budżet orientacyjny (opcjonalnie)</span>
                <div class="nb-pills nb-pills--2">
                  {#each budgetOpts as b}<button type="button" class="nb-pill nb-pill--wide" class:sel={f.budget===b} onclick={()=>f.budget=b}>{b}</button>{/each}
                </div>
              </div>
            </div>
          {:else if step === 7}
            <div class="nb-stack">
              <div class="nb-grid2">
                <div class="nb-field">
                  <span class="nb-field__label caption">Imię i nazwisko *</span>
                  <input class="nb-input" class:is-invalid={touched.name && !!errors.name} type="text" value={f.name} maxlength={80} autocomplete="name"
                    onbeforeinput={blockChars(NAME_CHARS)}
                    oninput={(e) => { const el = e.currentTarget as HTMLInputElement; const clean = sanitizeName(el.value); applySanitized(el, clean); f.name = clean; }}
                    onblur={() => touched.name = true}/>
                  {#if touched.name && errors.name}<span class="nb-field__error">{errors.name}</span>{/if}
                </div>
                <div class="nb-field">
                  <span class="nb-field__label caption">Email firmowy *</span>
                  <input class="nb-input" class:is-invalid={touched.email && !!errors.email} type="email" bind:value={f.email} maxlength={120} autocomplete="email"
                    onblur={() => touched.email = true}/>
                  {#if touched.email && errors.email}<span class="nb-field__error">{errors.email}</span>{/if}
                </div>
              </div>
              <div class="nb-grid2">
                <div class="nb-field">
                  <span class="nb-field__label caption">Telefon (opcjonalnie)</span>
                  <input class="nb-input" class:is-invalid={touched.phone && !!errors.phone} type="tel" inputmode="tel" value={f.phone} maxlength={20} autocomplete="tel"
                    onbeforeinput={blockChars(PHONE_CHARS)}
                    oninput={(e) => { const el = e.currentTarget as HTMLInputElement; const clean = sanitizePhone(el.value); applySanitized(el, clean); f.phone = clean; }}
                    onblur={() => touched.phone = true}/>
                  {#if touched.phone && errors.phone}<span class="nb-field__error">{errors.phone}</span>{/if}
                </div>
                <div class="nb-field">
                  <span class="nb-field__label caption">Nazwa firmy *</span>
                  <input class="nb-input" class:is-invalid={touched.company && !!errors.company} type="text" bind:value={f.company} maxlength={120} autocomplete="organization"
                    onblur={() => touched.company = true}/>
                  {#if touched.company && errors.company}<span class="nb-field__error">{errors.company}</span>{/if}
                </div>
              </div>
              <div class="nb-field">
                <span class="nb-field__label caption">NIP (opcjonalnie, do faktury)</span>
                <input class="nb-input nb-input--narrow" class:is-invalid={touched.nip && !!errors.nip} type="text" value={f.nip} maxlength={15} placeholder="7831898094 lub PL7831898094"
                  onbeforeinput={blockChars(NIP_CHARS)}
                  oninput={(e) => { const el = e.currentTarget as HTMLInputElement; const clean = sanitizeNip(el.value); applySanitized(el, clean); f.nip = clean; }}
                  onblur={() => touched.nip = true}/>
                {#if touched.nip && errors.nip}<span class="nb-field__error">{errors.nip}</span>{/if}
              </div>
              <div class="nb-consents">
                <label class="nb-check"><input type="checkbox" bind:checked={f.agreedPrivacy}/><span class="nb-check__box"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12.5 L10 17.5 L19 6.5" /></svg></span><span>Wyrażam zgodę na przetwarzanie danych zgodnie z <a class="nb-link" href="/polityka-prywatnosci">Polityką Prywatności</a>.</span></label>
                <label class="nb-check"><input type="checkbox" bind:checked={f.agreedTerms}/><span class="nb-check__box"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12.5 L10 17.5 L19 6.5" /></svg></span><span>Akceptuję <a class="nb-link" href="/regulamin">Regulamin</a>.</span></label>
              </div>
            </div>
          {/if}

          <input type="text" tabindex={-1} autocomplete="off" bind:value={f.honeypot} class="nb-honeypot" aria-hidden="true"/>
          {#if submitState === "error" && submitError}
            <div class="nb-brief__submit-error">{submitError}</div>
          {/if}
        </div>
      </div>

      <div class="nb-brief__nav">
        <button type="button" class="nb-brief__back" onclick={()=>goto(step-1)} disabled={step===1}>← Wstecz</button>
        {#if stepHint}
          <span class="nb-brief__nav-hint mono" aria-live="polite">{stepHint}</span>
        {/if}
        {#if step < TOTAL}
          <button class="nb-btn nb-btn--primary nb-btn--md" disabled={!canProceed(step)} onclick={()=>goto(step+1)}>
            <span class="nb-btn__label">Dalej</span>
            <span class="nb-btn__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
                <path d="M5 12 H19 M13 6 L19 12 L13 18" />
              </svg>
            </span>
          </button>
        {:else}
          <button class="nb-btn nb-btn--primary nb-btn--md" disabled={!canProceed(7) || isSubmitting} onclick={submit}>
            <span class="nb-btn__label">{isSubmitting ? "Wysyłanie…" : "Wyślij zgłoszenie"}</span>
            {#if !isSubmitting}
              <span class="nb-btn__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
                  <path d="M5 12 H19 M13 6 L19 12 L13 18" />
                </svg>
              </span>
            {/if}
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
/* ============================================================
   NOBELION — Brief: dark progress/dossier rail + light Q&A
   ============================================================ */
.nb-brief{background:var(--paper-3);position:relative;}

.nb-brief__shell{display:grid;grid-template-columns:330px 1fr;max-width:1080px;margin:0 auto;
  background:var(--paper-2);border:1px solid var(--paper-edge);box-shadow:var(--shadow-lift);overflow:hidden;transition:min-height 0.28s var(--ease-out);}

/* ---- LEFT rail (dark) ---- */
.nb-brief__rail{padding:clamp(28px,3vw,38px);display:flex;flex-direction:column;}
.nb-brief__rail-top{display:flex;align-items:center;gap:14px;padding-bottom:26px;border-bottom:1px solid var(--hair-light);}
.nb-brief__rail-mark{width:44px;height:44px;flex-shrink:0;}
.nb-brief__rail-name{font-family:var(--font-heading);font-weight:700;font-size:16px;letter-spacing:0.1em;text-transform:uppercase;color:var(--silver);}
.nb-brief__rail-sub{font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--steel);margin-top:3px;}


.nb-brief__steps{list-style:none;margin:26px 0 0;padding:0;display:flex;flex-direction:column;gap:2px;}
.nb-brief__step{padding:0;}
.nb-brief__step-btn{display:flex;align-items:center;gap:14px;padding:10px 0;width:100%;background:none;border:none;text-align:left;cursor:default;}
.nb-brief__step.reach .nb-brief__step-btn{cursor:pointer;}
.nb-brief__step-btn:disabled{cursor:default;opacity:1;}
.nb-brief__step-mark{width:30px;height:30px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--hair-light);font-family:var(--font-mono);font-size:12px;color:var(--steel);transition:all var(--dur-base) var(--ease-out);}
.nb-brief__step-label{font-family:var(--font-sans);font-weight:500;font-size:14px;letter-spacing:0.02em;color:var(--steel-dim);transition:color var(--dur-base);}
.nb-brief__step.is-done .nb-brief__step-mark{background:var(--brass-bright);border-color:var(--brass-bright);color:var(--void);}
.nb-brief__step.is-done .nb-brief__step-label{color:var(--silver-soft);}
.nb-brief__step.is-active .nb-brief__step-mark{border-color:var(--brass-bright);color:var(--brass-bright);box-shadow:0 0 0 3px rgba(197,160,89,0.16);}
.nb-brief__step.is-active .nb-brief__step-label{color:var(--silver);}
.nb-brief__step.reach:hover .nb-brief__step-label{color:var(--brass-bright);}

.nb-brief__dossier{margin-top:auto;padding-top:26px;border-top:1px solid var(--hair-light);}
.nb-brief__dossier-h{display:block;color:var(--steel-dim);margin-bottom:14px;}
.nb-brief__dossier-empty{font-size:13px;color:var(--steel-dim);margin:0;line-height:1.5;}
.nb-brief__drow{display:flex;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid var(--hair-light-2);}
.nb-brief__dk{font-size:10.5px;letter-spacing:0.12em;text-transform:uppercase;color:var(--steel-dim);}
.nb-brief__dv{font-size:13px;color:var(--silver-soft);text-align:right;}
.nb-brief__roi{margin-top:18px;border:1px solid rgba(197,160,89,0.4);background:rgba(197,160,89,0.07);padding:16px 18px;display:flex;flex-direction:column;gap:4px;animation:roi-in 0.5s var(--ease-out);}
.nb-brief__roi .caption{color:var(--brass-bright);}
.nb-brief__roi-big{font-family:var(--font-heading);font-weight:700;font-size:clamp(22px,2vw,28px);color:var(--silver);line-height:1;}
.nb-brief__roi-note{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--steel);}

/* ---- RIGHT main (light) ---- */
.nb-brief__main{padding:clamp(26px,3.2vw,44px);display:flex;flex-direction:column;min-width:0;transition:min-height 0.32s var(--ease-out);}
.nb-brief__progress{margin-bottom:8px;}

.nb-brief__progress-meta{display:flex;justify-content:space-between;margin-bottom:12px;}
.nb-brief__progress-meta .mono{font-size:11.5px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-3);}
.nb-brief__progress-meta .mono:first-child{color:var(--brass);}
.nb-brief__bar{height:2px;background:var(--paper-edge);overflow:hidden;}
.nb-brief__bar-fill{height:100%;background:var(--brass);transition:width 0.5s var(--ease-cinema);}

.nb-brief__q{margin-top:30px;flex:1;animation:q-in 0.42s var(--ease-out);}
.nb-brief__q.shake{animation:nb-shake 0.42s ease;}
@keyframes q-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
@keyframes nb-shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(7px);}40%,80%{transform:translateX(-7px);}}
.nb-brief__q-title{font-family:var(--font-heading);font-weight:700;font-size:clamp(23px,2.6vw,33px);letter-spacing:0.03em;text-transform:uppercase;color:var(--ink);margin:0 0 10px;line-height:1.12;text-wrap:balance;}
.nb-brief__q-sub{font-size:15px;line-height:1.55;color:var(--ink-3);margin:0 0 28px;max-width:520px;}

.nb-brief__fields{display:block;overflow:visible;}

.nb-stack{display:flex;flex-direction:column;gap:22px;}
.nb-stack--sm{gap:10px;}

/* fields */
.nb-field{display:flex;flex-direction:column;}
.nb-field__label{display:block;color:var(--brass);margin-bottom:11px;letter-spacing:0.18em;}
.nb-field__hint{font-family:var(--font-mono);font-size:10.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-4);margin-top:8px;}

.nb-input{width:100%;background:var(--paper);border:1px solid var(--paper-edge);padding:14px 16px;font-family:var(--font-sans);font-size:16px;color:var(--ink);transition:border-color var(--dur-fast),box-shadow var(--dur-fast);}
.nb-input::placeholder{color:var(--ink-4);}
.nb-input:focus{outline:none;border-color:var(--brass);box-shadow:0 0 0 3px rgba(184,137,62,0.12);}
.nb-input.is-invalid{border-color:var(--danger);}
.nb-input.is-invalid:focus{border-color:var(--danger);box-shadow:0 0 0 3px rgba(180,40,40,0.10);}
.nb-field__error{margin-top:7px;font-size:12.5px;line-height:1.4;color:var(--danger);}
.nb-input--sm{padding:9px 12px;font-size:14px;}
.nb-input--narrow{max-width:280px;}
.nb-textarea{resize:vertical;line-height:1.6;min-height:120px;}

.nb-select{position:relative;}
.nb-select::after{content:"";position:absolute;right:18px;top:50%;width:8px;height:8px;border-right:1.5px solid var(--ink-3);border-bottom:1.5px solid var(--ink-3);transform:translateY(-70%) rotate(45deg);pointer-events:none;}
.nb-select select{width:100%;appearance:none;-webkit-appearance:none;background:var(--paper);border:1px solid var(--paper-edge);padding:14px 16px;font-family:var(--font-sans);font-size:16px;color:var(--ink);cursor:pointer;transition:border-color var(--dur-fast);}
.nb-select select:focus{outline:none;border-color:var(--brass);}

.nb-brief__meta{display:flex;justify-content:space-between;align-items:center;margin-top:10px;gap:12px;}
.nb-brief__meta .mono{font-size:11px;letter-spacing:0.08em;color:var(--ink-3);}
.nb-brief__meta .mono.warn{color:var(--danger);}
.nb-link{font-family:var(--font-mono);font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:var(--brass);background:none;border:none;cursor:pointer;padding:0;transition:color var(--dur-fast);}
.nb-link:hover{color:var(--brass-dark);}

/* diagnosis */
.nb-diag{display:flex;align-items:flex-start;gap:18px;width:100%;text-align:left;background:var(--paper);border:1px solid var(--paper-edge);padding:18px 20px;cursor:pointer;transition:border-color var(--dur-base),background var(--dur-base),box-shadow var(--dur-base);}
.nb-diag:hover{border-color:rgba(184,137,62,0.5);}
.nb-diag.sel{border-color:var(--brass);background:color-mix(in srgb, var(--brass), transparent 87%);box-shadow:inset 0 0 0 1px var(--brass), 0 8px 24px -14px rgba(184,137,62,0.5);}

.nb-diag__n{font-family:var(--font-mono);font-size:15px;color:var(--brass);flex-shrink:0;padding-top:2px;}
.nb-diag__txt{flex:1;display:flex;flex-direction:column;gap:4px;}
.nb-diag__t{font-family:var(--font-heading);font-weight:600;font-size:15px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);}
.nb-diag__b{font-size:14px;color:var(--ink-3);}
.nb-diag__check{flex-shrink:0;width:24px;height:24px;border:1px solid var(--paper-edge);display:flex;align-items:center;justify-content:center;color:transparent;transition:all var(--dur-base);}
.nb-diag.sel .nb-diag__check{background:var(--brass);border-color:var(--brass);color:var(--void);}


/* pills */
.nb-pills{display:grid;gap:10px;}
.nb-pills--4{grid-template-columns:repeat(4,1fr);}
.nb-pills--3{grid-template-columns:repeat(3,1fr);}
.nb-pills--2{grid-template-columns:1fr 1fr;}
.nb-pill{background:var(--paper);border:1px solid var(--paper-edge);padding:13px 14px;font-family:var(--font-mono);font-size:13px;letter-spacing:0.08em;color:var(--ink-2);cursor:pointer;text-align:center;transition:all var(--dur-fast);}
.nb-pill--wide{text-align:left;letter-spacing:0.04em;font-size:12.5px;}
.nb-pill:hover{border-color:rgba(184,137,62,0.5);color:var(--brass);}
.nb-pill.sel{border-color:var(--brass);background:color-mix(in srgb, var(--brass), transparent 84%);color:var(--brass-dark);font-weight:600;box-shadow:inset 0 0 0 1px var(--brass);}

@media(max-width:520px){.nb-pills--4{grid-template-columns:1fr 1fr;}.nb-pills--2{grid-template-columns:1fr;}}

/* slider */
.nb-slider-row{display:flex;align-items:center;gap:24px;}
.nb-slider{-webkit-appearance:none;appearance:none;flex:1;height:3px;background:var(--paper-edge);outline:none;border-radius:2px;}
.nb-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;background:var(--brass);border:3px solid var(--paper-2);border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(184,137,62,0.45);}
.nb-slider::-moz-range-thumb{width:20px;height:20px;background:var(--brass);border:3px solid var(--paper-2);border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(184,137,62,0.45);}
.nb-slider__val{font-family:var(--font-heading);font-weight:700;font-size:clamp(24px,2.4vw,32px);color:var(--brass);min-width:74px;text-align:right;}

/* helper */
.nb-helper{border:1px solid rgba(184,137,62,0.3);background:rgba(184,137,62,0.03);padding:20px;display:flex;flex-direction:column;gap:14px;}
.nb-helper__h{color:var(--brass);}
.nb-helper__row{display:flex;flex-direction:column;gap:7px;}
.nb-helper__row span{font-size:13px;color:var(--ink-2);}

/* drop */
.nb-drop{display:flex;flex-direction:column;align-items:center;gap:8px;border:1px dashed rgba(184,137,62,0.4);padding:26px;color:var(--brass);text-align:center;}
.nb-drop .caption{color:var(--ink-3);}
.nb-drop__hint{font-family:var(--font-mono);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-4);}
.nb-drop__upload{margin-top:6px;display:inline-flex;align-items:center;justify-content:center;padding:9px 14px;border:1px solid var(--brass);font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--brass);cursor:pointer;}
.nb-drop__input{display:none;}
.nb-drop__list{margin-top:8px;width:100%;display:flex;flex-direction:column;gap:8px;}
.nb-drop__item{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:8px 10px;border:1px solid var(--paper-edge);background:var(--paper);}
.nb-drop__name{font-size:13px;color:var(--ink);text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.nb-drop__size{font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-4);}
.nb-drop__remove{background:none;border:none;padding:0;font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--danger);cursor:pointer;}
.nb-drop__error{font-family:var(--font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--danger);}
.nb-brief__submit-error{margin-top:18px;padding:12px 14px;border:1px solid rgba(180,40,40,0.35);background:rgba(180,40,40,0.06);border-radius:var(--r-control);font-size:13px;line-height:1.45;color:var(--danger);}

/* checkboxes */
.nb-checks{display:flex;flex-direction:column;gap:8px;}
/* Delikatnie wyraźniejszy wybór — inspirowany add-onem wyceny, ale subtelny:
   brief ma wiele checkboxów, więc bez mocnych mosiężnych kart. Box ma miękką
   mosiężną ramkę (czytelny jako „do zaznaczenia"), a stan zaznaczony wyróżnia się jasno. */
.nb-check{display:flex;align-items:flex-start;gap:13px;padding:13px 15px;border:1px solid color-mix(in srgb, var(--brass), transparent 72%);background:var(--paper);cursor:pointer;font-size:14px;color:var(--ink-2);line-height:1.5;transition:border-color var(--dur-fast),background var(--dur-fast);}
.nb-check:hover{border-color:color-mix(in srgb, var(--brass), transparent 35%);}
.nb-check.sel{border-color:var(--brass);background:color-mix(in srgb, var(--brass), transparent 92%);}

.nb-check input{position:absolute;opacity:0;width:0;height:0;}
.nb-check__box{flex-shrink:0;width:20px;height:20px;border:1px solid color-mix(in srgb, var(--brass), transparent 40%);background:var(--paper);display:flex;align-items:center;justify-content:center;color:transparent;margin-top:1px;transition:all var(--dur-fast);}
.nb-check:hover .nb-check__box{border-color:var(--brass);}
.nb-check input:focus-visible + .nb-check__box{outline:2px solid var(--brass);outline-offset:2px;}
.nb-check input:checked + .nb-check__box{background:var(--brass);border-color:var(--brass);color:var(--void);}


/* scope */
.nb-scope{display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;background:var(--paper);border:1px solid var(--paper-edge);padding:16px 18px;cursor:pointer;transition:all var(--dur-fast);}
.nb-scope:hover{border-color:rgba(184,137,62,0.5);}
.nb-scope.sel{border-color:var(--brass);background:color-mix(in srgb, var(--brass), transparent 87%);box-shadow:inset 0 0 0 1px var(--brass);}
.nb-scope.sel .nb-scope__l{color:var(--brass-dark);}

.nb-scope__l{font-family:var(--font-heading);font-weight:600;font-size:15px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink);}
.nb-scope__d{font-size:13px;color:var(--ink-3);}

/* consents */
.nb-consents{display:flex;flex-direction:column;gap:14px;padding-top:22px;border-top:1px solid var(--hair-ink);}
.nb-consents .nb-check{border:none;background:none;padding:0;}
.nb-consents .nb-check:hover{border:none;}
.nb-consents .nb-check a{color:var(--brass);text-decoration:underline;}

.nb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
@media(max-width:560px){.nb-grid2{grid-template-columns:1fr;}}
.nb-honeypot{position:absolute;left:-9999px;opacity:0;pointer-events:none;height:0;width:0;}

/* nav */
.nb-brief__nav{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:32px;padding-top:24px;border-top:1px solid var(--hair-ink);}
.nb-brief__nav-hint{margin-left:auto;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3);text-align:right;max-width:340px;line-height:1.5;}
/* Nieaktywny przycisk: jednoznacznie "jeszcze nie" — wyblakły, przerywana ramka */
.nb-brief__nav .nb-btn:disabled{opacity:1;background:var(--paper);color:var(--ink-4);border:1px dashed var(--ink-4);cursor:not-allowed;box-shadow:none;transform:none;}
.nb-brief__nav .nb-btn:disabled:hover{background:var(--paper);color:var(--ink-4);box-shadow:none;}
@media(max-width:560px){
  .nb-brief__nav{flex-wrap:wrap;}
  .nb-brief__nav-hint{order:3;flex-basis:100%;text-align:left;margin-left:0;}
}
.nb-brief__back{font-family:var(--font-mono);font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-3);background:none;border:none;cursor:pointer;transition:color var(--dur-fast);}
.nb-brief__back:hover:not(:disabled){color:var(--brass);}
.nb-brief__back:disabled{opacity:0.4;cursor:not-allowed;}

/* success */
.nb-brief__shell--done{display:flex;flex-direction:column;align-items:center;text-align:center;padding:clamp(64px,8vw,110px) 24px;}
.nb-brief__check{width:80px;height:80px;border:2px solid var(--brass);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--brass);margin-bottom:34px;animation:roi-in 0.6s var(--ease-out);}
@keyframes roi-in{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.nb-brief__done-title{margin:0 0 18px;}
.nb-brief__done-body{font-size:18px;line-height:1.6;color:var(--ink-2);max-width:480px;margin:0 0 14px;}
.nb-brief__done-mail{color:var(--brass);}

@media(max-width:860px){
  .nb-brief__shell{grid-template-columns:1fr;min-height:unset !important;}
  .nb-brief__main{order:1;padding:22px 18px;min-height:unset !important;}
  .nb-brief__rail{order:2;border-top:1px solid var(--hair-light);padding:18px;gap:14px;}
  .nb-brief__rail-top{display:none;}
  .nb-brief__steps{display:none;}
  .nb-brief__dossier{margin-top:0;padding-top:0;border-top:none;}
  .nb-brief__dossier.is-empty{display:none;}
  .nb-brief__dossier-h{margin-bottom:10px;}
  .nb-brief__dossier-empty{font-size:12px;line-height:1.45;}
  .nb-brief__drow{padding:7px 0;}
  .nb-brief__roi{margin-top:12px;padding:12px 14px;}
  .nb-brief__nav{position:sticky;bottom:0;background:var(--paper-2);padding-top:16px;padding-bottom:env(safe-area-inset-bottom,0);z-index:2;}
}

/* ============================================================
   RADIUS SYSTEM — radius scales with element size.
   ============================================================ */
:root{
  --r-inset:6px;
  --r-control:9px;
  --r-card:14px;
  --r-shell:18px;
}

/* controls */
.nb-btn,
.nb-header__cta,.nb-footer__cta,
.nb-input,.nb-select select,.nb-textarea,.nb-input--sm,
.nb-pill,.nb-diag,.nb-scope,.nb-check{border-radius:var(--r-control);}

/* tiny tiles */
.nb-tag,.nb-case__step,
.nb-offer__icon,.nb-cap__icon,.nb-sec-card__icon,
.nb-check__box,.nb-brief__step-mark,.nb-case__metric{border-radius:var(--r-inset);}

/* standalone cards & callouts */
.nb-offer__card,
.nb-drop,.nb-helper,.nb-roi,.nb-brief__roi,
.nb-case__frame,.nb-showcase__frame{border-radius:var(--r-card);}

/* large composite surfaces */
.nb-brief__shell{border-radius:var(--r-shell);}

</style>
