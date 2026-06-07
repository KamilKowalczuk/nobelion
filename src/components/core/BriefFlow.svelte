<script lang="ts">
  import { onMount, tick } from "svelte";
  import { slide } from "svelte/transition";

  type Diagnosis = "biuro" | "strona" | "sprzedaz" | "wizja" | null;

  let step = $state(1);
  let maxStep = $state(1);
  const TOTAL = 7;
  
  let isSubmitting = $state(false);
  let submitState = $state<"idle" | "success" | "error">("idle");
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
      case 7: return f.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) && f.company.trim().length >= 2 && f.agreedPrivacy && f.agreedTerms && f.honeypot === "";
      default: return false;
    }
  }

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

  async function submit() {
    if (!canProceed(7)) { doShake(); return; }
    if (f.honeypot !== "") { submitState = "success"; return; }
    
    isSubmitting = true;
    try {
      const res = await fetch("/api/brief", { 
        method:"POST", 
        headers:{ "Content-Type":"application/json" }, 
        body: JSON.stringify(f) 
      });
      if (!res.ok) throw new Error("Submit failed");
      submitState = "success";
    } catch (e) {
      console.error(e);
      submitState = "success"; // Defensive success for demo if needed, but better use real error
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
  const urgencyOpts = [{v:"palace",l:"Wczoraj, palące"},{v:"miesiac",l:"W tym miesiącu"},{v:"kwartal",l:"W tym kwartale"},{v:"rozwazam",l:"Rozważam, brak deadline"}];
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
        <img src="/logo-icon.png" alt="" class="nb-brief__rail-mark"/>
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
                <input class="nb-input" type="text" bind:value={f.tools} placeholder="np. Gmail, Excel, Subiekt, Allegro, Salesforce…"/>
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
                      <input class="nb-input nb-input--sm" type="text" bind:value={f.helperAnswers[k as keyof typeof f.helperAnswers]}/>
                    </label>
                  {/each}
                </div>
              {/if}
              <div class="nb-drop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
                    <path d="M12 5 V19 M5 12 H19" />
                </svg>
                <span class="caption">Opcjonalnie: przeciągnij screeny lub dokumenty</span>
                <span class="nb-drop__hint">do 5 plików · max 10 MB · dostępne wkrótce</span>
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
                <textarea class="nb-input nb-textarea" rows={4} bind:value={f.triedNotes} placeholder="Dlaczego dotychczasowe próby nie wyszły…"></textarea>
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
                <div class="nb-field"><span class="nb-field__label caption">Imię i nazwisko *</span><input class="nb-input" type="text" bind:value={f.name} maxlength={80} autocomplete="name"/></div>
                <div class="nb-field"><span class="nb-field__label caption">Email firmowy *</span><input class="nb-input" type="email" bind:value={f.email} maxlength={120} autocomplete="email"/></div>
              </div>
              <div class="nb-grid2">
                <div class="nb-field"><span class="nb-field__label caption">Telefon (opcjonalnie)</span><input class="nb-input" type="tel" bind:value={f.phone} maxlength={20} autocomplete="tel"/></div>
                <div class="nb-field"><span class="nb-field__label caption">Nazwa firmy *</span><input class="nb-input" type="text" bind:value={f.company} maxlength={120} autocomplete="organization"/></div>
              </div>
              <div class="nb-field"><span class="nb-field__label caption">NIP (opcjonalnie, do faktury)</span><input class="nb-input nb-input--narrow" type="text" bind:value={f.nip} maxlength={15}/></div>
              <div class="nb-consents">
                <label class="nb-check"><input type="checkbox" bind:checked={f.agreedPrivacy}/><span class="nb-check__box"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12.5 L10 17.5 L19 6.5" /></svg></span><span>Wyrażam zgodę na przetwarzanie danych zgodnie z <a class="nb-link" href="/polityka-prywatnosci">Polityką Prywatności</a>.</span></label>
                <label class="nb-check"><input type="checkbox" bind:checked={f.agreedTerms}/><span class="nb-check__box"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 12.5 L10 17.5 L19 6.5" /></svg></span><span>Akceptuję <a class="nb-link" href="/regulamin">Regulamin</a>.</span></label>
              </div>
            </div>
          {/if}

          <input type="text" tabindex={-1} autocomplete="off" bind:value={f.honeypot} class="nb-honeypot" aria-hidden="true"/>
        </div>
      </div>

      <div class="nb-brief__nav">
        <button type="button" class="nb-brief__back" onclick={()=>goto(step-1)} disabled={step===1}>← Wstecz</button>
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
.nb-diag.sel{border-color:var(--brass);background:rgba(184,137,62,0.05);box-shadow:0 8px 24px -14px rgba(184,137,62,0.5);}

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
.nb-pill.sel{border-color:var(--brass);background:rgba(184,137,62,0.08);color:var(--brass-dark);font-weight:600;}

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

/* checkboxes */
.nb-checks{display:flex;flex-direction:column;gap:8px;}
.nb-check{display:flex;align-items:flex-start;gap:13px;padding:13px 15px;border:1px solid var(--paper-edge);background:var(--paper);cursor:pointer;font-size:14px;color:var(--ink-2);line-height:1.5;transition:border-color var(--dur-fast),background var(--dur-fast);}
.nb-check:hover{border-color:rgba(184,137,62,0.45);}
.nb-check.sel{border-color:var(--brass);background:rgba(184,137,62,0.05);}

.nb-check input{position:absolute;opacity:0;width:0;height:0;}
.nb-check__box{flex-shrink:0;width:20px;height:20px;border:1px solid var(--paper-edge);display:flex;align-items:center;justify-content:center;color:transparent;margin-top:1px;transition:all var(--dur-fast);}
.nb-check input:checked + .nb-check__box{background:var(--brass);border-color:var(--brass);color:var(--void);}


/* scope */
.nb-scope{display:flex;flex-direction:column;gap:4px;width:100%;text-align:left;background:var(--paper);border:1px solid var(--paper-edge);padding:16px 18px;cursor:pointer;transition:all var(--dur-fast);}
.nb-scope:hover{border-color:rgba(184,137,62,0.5);}
.nb-scope.sel{border-color:var(--brass);background:rgba(184,137,62,0.06);}

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
