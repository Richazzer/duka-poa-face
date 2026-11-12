import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

export default function HomeLanding() {
  const navigate = useNavigate();

  const glassPanel =
    'border border-white/70 dark:border-white/10 bg-white/60 dark:bg-[#121724]/70 backdrop-blur-2xl shadow-[0_18px_50px_rgba(15,23,42,0.10),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)]';

  const featureCard =
    'rounded-[30px] border border-white/70 bg-white/55 p-7 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/60 dark:border-white/10 dark:bg-[#121722]/65 dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)] dark:hover:border-blue-500/50 sm:p-8';

  const metrics = [
    {
      title: 'Thamani ya Duka (Net Worth)',
      amount: 'TZS 18,450,000',
      note: 'Stoo + Mauzo + Madeni',
      tone: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      title: 'Mauzo ya Leo',
      amount: 'TZS 485,000',
      note: '32 Miamala ya Haraka',
      tone: 'text-blue-700 dark:text-blue-400',
    },
    {
      title: 'Kipimo cha Madeni',
      amount: 'TZS 45,000',
      note: 'Salama (Chini ya 15%)',
      tone: 'text-amber-700 dark:text-amber-400',
    },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: 'Kaunta ya Mauzo (POS)',
      text: 'Kamilisha mauzo kwa haraka kwa Cash, Simu au Deni. Mfumo unapunguza stoo kiotomatiki na kutoa risiti.',
      tone: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    },
    {
      icon: BarChart3,
      title: 'Takwimu za Biashara',
      text: 'Fuatilia mauzo, stoo na mwenendo wa biashara yako kupitia dashibodi rahisi kutumia.',
      tone: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    },
    {
      icon: ShieldCheck,
      title: 'Madeni na Usalama',
      text: 'Weka kumbukumbu za madeni ya wateja na taarifa za biashara yako katika akaunti yako.',
      tone: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#070a12] dark:text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[440px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-300/45 via-indigo-300/35 to-emerald-200/35 blur-[130px] dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-emerald-500/15" />
      <div className="pointer-events-none absolute right-[-140px] top-[42%] h-[480px] w-[480px] rounded-full bg-blue-300/25 blur-[120px] dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute bottom-[5%] left-[-150px] h-[560px] w-[560px] rounded-full bg-emerald-300/25 blur-[140px] dark:bg-emerald-500/10" />

      <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4 sm:px-6">
        <nav className={`flex h-16 items-center justify-between rounded-full px-4 sm:px-6 ${glassPanel}`}>
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Duka Poa home"
            className="group flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-black text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              D
            </span>
            <span>
              <span className="block text-sm font-black leading-none tracking-tight sm:text-base">
                Duka Poa <span className="text-blue-600 dark:text-blue-400">POS</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Smart Retail Platform
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Vipengele
            </a>
            <a href="#forex" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Takwimu za Biashara
            </a>
            <a href="#security" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Usalama wa Duka
            </a>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-white/50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white sm:px-5"
            >
              Ingia
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95 sm:px-5"
            >
              Anza Bure <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl space-y-24 px-6 pb-20 pt-16 sm:pt-24">
        <section className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/70 bg-white/55 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-800 shadow-sm backdrop-blur-xl dark:border-blue-800/60 dark:bg-blue-950/50 dark:text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500 dark:bg-blue-400" />
            Mfumo wa Kisasa wa POS na Usimamizi wa Maduka
          </div>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Mauzo Mengi Zaidi.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-emerald-400">
              Bila Kazi Ngumu.
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            Imeundwa maalum kwa ajili ya maduka ya Tanzania. Rekodi mauzo kwa
            haraka, dhibiti madeni ya wateja na uone mwenendo wa biashara yako
            kwa urahisi.
          </p>

          <div className="flex w-full max-w-md flex-col justify-center gap-3.5 pt-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
            >
              Fungua Duka Lako Sasa <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/80 bg-white/55 px-8 py-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Ingia kwenye Akaunti
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {['Usajili wa papo hapo', 'Cloud Database', 'Salama kwa simu na kompyuta'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          id="forex"
          className={`mx-auto max-w-5xl rounded-[36px] bg-gradient-to-b from-white/80 via-blue-100/35 to-white/10 p-2 sm:p-3.5 dark:from-white/10 dark:via-slate-800/40 dark:to-transparent ${glassPanel}`}
        >
          <div className="space-y-6 rounded-[28px] border border-white/70 bg-white/45 p-5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#0e131d]/75 sm:p-8">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800/80 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-xs font-bold text-slate-500">
                  dukapoa.co.tz/app
                </span>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Seva Iko Hewani
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {metrics.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#141a26]/80"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>
                  <h3 className={`mt-1 text-xl font-black sm:text-2xl ${item.tone}`}>
                    {item.amount}
                  </h3>
                  <span className="mt-2 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {item.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/60 bg-white/45 p-5 backdrop-blur-xl dark:border-slate-700/70 dark:bg-[#121722]/80 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-white">
                    Mwelekeo wa Mauzo
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Angalia mwenendo wa mauzo yako kwa muhtasari.
                  </p>
                </div>
              </div>
              <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                LIVE ↗
              </span>
            </div>
          </div>
        </section>

        <section id="features" className="space-y-10">
          <div className="mx-auto max-w-xl space-y-2 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Kila kitu unachohitaji
              <br />
              kuendesha duka la kisasa.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ondoa madaftari ya zamani na uendeshe biashara kwa uhakika wa kidijitali.
            </p>
          </div>

          <div id="security" className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text, tone }) => (
              <article key={title} className={featureCard}>
                <span className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mb-2 text-lg font-black">{title}</h3>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className={`relative overflow-hidden rounded-[36px] p-8 text-center sm:p-14 ${glassPanel}`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10" />
          <div className="relative space-y-6">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 dark:text-blue-300">
              <Sparkles className="h-7 w-7" />
            </span>
            <div className="mx-auto max-w-lg space-y-2">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Anza kutumia Duka Poa leo.
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                Fungua akaunti yako na uanze kurekodi bidhaa, mauzo na madeni.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full bg-blue-600 px-10 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
            >
              Fungua Akaunti ya Duka <ArrowRight className="ml-1 inline h-4 w-4" />
            </button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-300/60 px-6 py-8 text-center text-xs text-slate-500 dark:border-slate-900">
        &copy; {new Date().getFullYear()} Duka Poa POS Tanzania. Haki zote zimehifadhiwa.
      </footer>
    </div>
  );
}
