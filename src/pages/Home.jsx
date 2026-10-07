import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

const img = (name) => `/site/img/${name}.webp`
const STUDIO = '/studio'

/* ---------- petits composants ---------- */
function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function Phone({ name, alt, className = '', eager = false }) {
  return (
    <div className={`rounded-[2.1rem] p-[3px] bg-gradient-to-br from-ink-600 via-ink-950 to-ink-700 ring-1 ring-gold-500/30 shadow-[0_30px_70px_rgba(0,0,0,0.65)] ${className}`}>
      <div className="rounded-[1.95rem] overflow-hidden bg-ink-900">
        <img src={img(name)} alt={alt} width="600" height="1298" loading={eager ? 'eager' : 'lazy'} decoding="async" className="block w-full h-auto" />
      </div>
    </div>
  )
}

function CTA({ children = 'Créer ma LOVEBOX', className = '' }) {
  return (
    <Link
      to={STUDIO}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 hover:bg-gold-400 active:scale-[0.98] text-ink-950 font-bold tracking-wide px-8 py-4 text-base sm:text-lg shadow-lg shadow-gold-500/25 transition ${className}`}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  )
}

function Eyebrow({ children }) {
  return <p className="font-script text-gold-400 text-2xl mb-3">{children}</p>
}

function Title({ children, className = '' }) {
  return <h2 className={`font-display text-4xl sm:text-5xl text-ivory leading-[1.08] ${className}`}>{children}</h2>
}

/* ---------- vidéo : ne se charge qu'au clic ---------- */
function VideoBlock() {
  const [playing, setPlaying] = useState(false)
  const [vertical, setVertical] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setVertical(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])
  const fmt = vertical ? '9x16' : '16x9'
  return (
    <div className={`relative mx-auto overflow-hidden rounded-2xl ring-1 ring-gold-500/30 shadow-[0_30px_80px_rgba(0,0,0,0.6)] bg-ink-900 ${vertical ? 'max-w-[300px] aspect-[9/16]' : 'max-w-4xl aspect-video'}`}>
      {playing ? (
        <video key={fmt} src={`/site/video/lovebox-${fmt}.mp4`} poster={`/site/video/poster-${fmt}.webp`} controls autoPlay playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label="Lire la vidéo de présentation" className="group absolute inset-0 w-full h-full">
          <img src={`/site/video/poster-${fmt}.webp`} alt="Aperçu de la vidéo de présentation de LOVEBOX" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-20 h-20 rounded-full bg-gold-500 text-ink-950 text-3xl pl-1 shadow-[0_0_50px_rgba(212,175,55,0.55)] group-hover:scale-105 transition-transform">▶</span>
          </span>
        </button>
      )}
    </div>
  )
}

/* ---------- contenus ---------- */
const STEPS = [
  { n: '01', t: 'Vous composez', d: 'En 9 étapes guidées, vous réunissez photos, vidéo, musique, lettre et surprises. Seuls le prénom, l’occasion, une photo et la lettre sont obligatoires.' },
  { n: '02', t: 'Vous partagez', d: 'Un lien à copier et à envoyer par WhatsApp ou par message. Rien à télécharger, aucun compte à créer pour le destinataire.' },
  { n: '03', t: 'Il ou elle vit l’expérience', d: 'Une ambiance à choisir, une boîte à ouvrir du bout du doigt, puis un espace à explorer à son rythme, autant de fois qu’il le souhaite.' },
]

const FEATURES = [
  { tag: 'Photos', t: 'Des souvenirs qui défilent comme des polaroïds', d: 'Ajoutez une anecdote à chaque photo, et même une question à deviner avant de révéler la réponse. Une vue catalogue permet de tout voir d’un coup d’œil.', phones: [['photos', 'Une photo en polaroïd avec sa question à deviner'], ['catalogue', 'La vue catalogue de toutes les photos']] },
  { tag: 'Lettre', t: 'Une lettre qu’on découvre', d: 'Une enveloppe scellée d’un cœur doré, trois papiers au choix — classique, manuscrit ou moderne — et votre musique qui démarre au moment de la révélation.', phones: [['lettre-enveloppe', 'L’enveloppe à toucher pour révéler la lettre'], ['lettre', 'La lettre qui apparaît ligne après ligne']] },
  { tag: 'Quiz', t: 'Un quiz sur votre histoire', d: 'Choisissez parmi des questions toutes prêtes ou écrivez les vôtres. Votre destinataire répond par Vrai ou Faux et découvre son score sur 100.', phones: [['quiz', 'Une question du quiz en Vrai ou Faux'], ['quiz-score', 'Le score final sur 100']] },
  { tag: 'Jeux', t: '11 mini-jeux pour prolonger le moment', d: 'Trouve le cœur, carte à gratter, roue des surprises, memory avec vos propres photos, photo mystère… Chacun choisit son jeu.', phones: [['jeux', 'La liste des 11 mini-jeux']] },
  { tag: 'Surprise', t: 'Un coffre au trésor à débloquer', d: 'Choisissez un nombre — son âge, une date importante — et votre destinataire touche le coffre jusqu’à ce qu’il s’ouvre. C’est une mise en scène : LOVEBOX n’envoie jamais d’argent.', phones: [['coffre', 'Le coffre au trésor qui attend d’être ouvert'], ['coffre-ouvert', 'Le coffre ouvert, rempli d’or']] },
]

const AMBIANCES = [
  { n: 'Onyx', d: 'Noir et or classique', i: 'ambiance-onyx' },
  { n: 'Bordeaux', d: 'Profond et chaleureux', i: 'ambiance-bordeaux' },
  { n: 'Minuit', d: 'Calme et étoilé', i: 'ambiance-minuit' },
  { n: 'Émeraude', d: 'Rare et précieux', i: 'ambiance-emeraude' },
]

const STUDIO_STEPS = [
  { i: 'studio-photos', t: 'Vos photos', d: 'Une anecdote, une question, une photo de couverture.' },
  { i: 'studio-lettre', t: 'Votre lettre', d: 'Trois papiers au choix et vos mots.' },
  { i: 'studio-interactivite', t: 'Vos jeux', d: 'Des questions de quiz à cocher, des pensées du jour.' },
]

const OCCASIONS = ['🎂 Anniversaire', '💌 Saint-Valentin', '💍 Anniversaire de couple', '✨ Juste parce que', '🎁 Autre occasion']

const FAQ = [
  ['Mon destinataire doit-il créer un compte ou installer une application ?', 'Non. Il ouvre simplement le lien que vous lui envoyez, depuis son téléphone ou son ordinateur.'],
  ['Quels contenus puis-je ajouter ?', 'Des photos avec anecdotes, une vidéo (un fichier ou un lien YouTube ou Vimeo), une musique d’ouverture, une musique pour la lettre, votre lettre, un quiz et des pensées du jour. Utilisez uniquement des musiques que vous avez le droit de partager.'],
  ['Puis-je modifier ma LOVEBOX après l’avoir créée ?', 'Pas pour l’instant : relisez bien tout avant de toucher « Terminer ».'],
  ['LOVEBOX envoie-t-elle de l’argent ?', 'Non. Le coffre est une mise en scène : si vous promettez un montant, c’est vous qui l’envoyez, par exemple par Mobile Money.'],
  ['Mon destinataire peut-il revenir plus tard ?', 'Oui. Le lien reste le même, et une pensée du jour différente l’attend chaque jour.'],
  ['Sur quels appareils cela fonctionne-t-il ?', 'Sur n’importe quel téléphone ou ordinateur doté d’un navigateur récent et d’une connexion internet.'],
]

const NAV = [['#comment', 'Comment ça marche'], ['#contenu', 'Ce qu’elle contient'], ['#faq', 'Questions']]

/* ---------- page ---------- */
export default function Home() {
  return (
    <div className="bg-ink-950 text-ivory min-h-screen overflow-x-hidden">
      {/* barre du haut */}
      <header className="fixed top-0 inset-x-0 z-40 bg-ink-950/80 backdrop-blur border-b border-gold-500/15">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <Link to="/" className="flex items-center gap-2" aria-label="LOVEBOX, accueil">
            <span className="text-gold-500 text-xl" aria-hidden="true">♥</span>
            <span className="font-display text-2xl tracking-[0.14em]">LOVEBOX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ivory/70">
            {NAV.map(([href, label]) => <a key={href} href={href} className="hover:text-gold-400 transition-colors">{label}</a>)}
          </nav>
          <Link to={STUDIO} className="rounded-full border border-gold-500/60 text-gold-400 hover:bg-gold-500 hover:text-ink-950 text-sm font-bold px-4 py-2 transition-colors">Créer ma LOVEBOX</Link>
        </div>
      </header>

      {/* en-tête */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-5">
        <div className="pointer-events-none absolute -top-24 right-[-10%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),rgba(212,175,55,0.05)_45%,transparent_70%)]" />
        {[...Array(16)].map((_, i) => (
          <span key={i} className="dust pointer-events-none absolute rounded-full bg-gold-300" style={{ left: `${(i * 37 + 11) % 97}%`, top: `${(i * 53 + 7) % 90}%`, width: 2 + (i % 3), height: 2 + (i % 3), animationDelay: `${(i % 7) * 0.8}s`, animationDuration: `${6 + (i % 5)}s` }} />
        ))}
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left">
            <Eyebrow>pour ceux qui comptent</Eyebrow>
            <h1 className="font-display text-[2.7rem] sm:text-6xl xl:text-7xl leading-[1.04] text-ivory">
              Offrez une émotion,<br /><span className="gold-text">pas seulement un cadeau.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-ivory/75 leading-relaxed max-w-xl mx-auto lg:mx-0">
              LOVEBOX est un cadeau numérique personnalisé : vos photos, une lettre, un quiz, des jeux et une surprise cachée, réunis dans un simple lien à offrir.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <CTA />
              <a href="#comment" className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4">Voir comment ça marche</a>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs sm:text-sm tracking-widest uppercase text-ivory/55">
              <li>Sans compte pour le destinataire</li><li>Sur tout téléphone</li><li>Un simple lien</li>
            </ul>
          </div>
          <div className="relative mx-auto w-[310px] h-[420px] sm:w-[460px] sm:h-[600px] lg:w-[520px] lg:h-[640px]">
            <Phone name="jeux" alt="La liste des mini-jeux de LOVEBOX" className="absolute w-[40%] left-0 top-[14%] -rotate-[8deg]" eager />
            <Phone name="photos" alt="Une photo en polaroïd dans l’espace du destinataire" className="absolute w-[47%] left-[26.5%] top-0 z-10" eager />
            <Phone name="coffre-ouvert" alt="Le coffre au trésor ouvert" className="absolute w-[40%] right-0 top-[14%] rotate-[8deg]" eager />
          </div>
        </div>
      </section>

      {/* vidéo */}
      <section className="px-5 py-16 md:py-24 border-t border-gold-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <Reveal>
            <Eyebrow>en 60 secondes</Eyebrow>
            <Title className="mb-10">Voyez ce que vit celui ou celle qui reçoit</Title>
            <VideoBlock />
          </Reveal>
        </div>
      </section>

      {/* comment ça marche */}
      <section id="comment" className="px-5 py-16 md:py-24 border-t border-gold-500/10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <Eyebrow>simple comme un message</Eyebrow>
            <Title>Comment ça marche</Title>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-gold-500/20 bg-ink-900/70 p-7">
                  <p className="font-display text-5xl gold-text mb-4">{s.n}</p>
                  <h3 className="font-display text-2xl text-ivory mb-2">{s.t}</h3>
                  <p className="text-ivory/70 leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* contenu */}
      <section id="contenu" className="px-5 py-16 md:py-24 border-t border-gold-500/10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <Eyebrow>tout est pensé pour l’émotion</Eyebrow>
            <Title>Ce que contient une LOVEBOX</Title>
          </Reveal>
          <div className="space-y-20 md:space-y-28">
            {FEATURES.map((f, i) => (
              <div key={f.tag} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <Reveal>
                  <span className="inline-block rounded-full border border-gold-500/50 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 mb-5">{f.tag}</span>
                  <h3 className="font-display text-3xl sm:text-4xl text-ivory leading-tight mb-4">{f.t}</h3>
                  <p className="text-ivory/75 text-lg leading-relaxed">{f.d}</p>
                </Reveal>
                <Reveal delay={0.1} className="flex justify-center gap-4">
                  {f.phones.map(([name, alt], k) => (
                    <Phone key={name} name={name} alt={alt} className={`${f.phones.length > 1 ? 'w-[44%] max-w-[210px]' : 'w-[56%] max-w-[250px]'} ${f.phones.length > 1 && k === 0 ? 'mt-8' : ''}`} />
                  ))}
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* studio */}
      <section className="px-5 py-16 md:py-24 border-t border-gold-500/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.08),transparent_60%)]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <Eyebrow>aucune compétence technique</Eyebrow>
            <Title className="mb-4">Un Studio guidé, étape par étape</Title>
            <p className="text-ivory/70 text-lg">Des suggestions toutes prêtes à cocher, et la liberté d’écrire les vôtres. Une barre dorée vous indique où vous en êtes.</p>
          </Reveal>
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 -mx-5 px-5 md:mx-0 md:px-0">
            {STUDIO_STEPS.map((s) => (
              <div key={s.i} className="snap-center shrink-0 w-[68%] sm:w-[44%] md:w-auto text-center">
                <Phone name={s.i} alt={`Le Studio LOVEBOX : ${s.t}`} className="mx-auto max-w-[240px]" />
                <h3 className="font-display text-2xl mt-5 mb-1">{s.t}</h3>
                <p className="text-ivory/65 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ambiances */}
      <section className="px-5 py-16 md:py-24 border-t border-gold-500/10">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <Eyebrow>au choix du destinataire</Eyebrow>
            <Title className="mb-4">Quatre ambiances, un seul geste</Title>
            <p className="text-ivory/70 text-lg">À l’ouverture, il ou elle choisit l’atmosphère de son expérience : noir et or, vin profond, nuit étoilée ou vert précieux.</p>
          </Reveal>
          <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 -mx-5 px-5 md:mx-0 md:px-0">
            {AMBIANCES.map((a) => (
              <div key={a.n} className="snap-center shrink-0 w-[62%] sm:w-[36%] md:w-auto text-center">
                <Phone name={a.i} alt={`L’ambiance ${a.n}`} className="mx-auto max-w-[220px]" />
                <h3 className="font-display text-2xl mt-5">{a.n}</h3>
                <p className="text-ivory/60 text-sm">{a.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* occasions */}
      <section className="px-5 py-16 md:py-20 border-t border-gold-500/10">
        <Reveal className="max-w-3xl mx-auto text-center">
          <Eyebrow>pour chaque occasion</Eyebrow>
          <Title className="mb-8">Un cadeau qui s’adapte</Title>
          <div className="flex flex-wrap justify-center gap-3">
            {OCCASIONS.map((o) => <span key={o} className="rounded-full border border-gold-500/30 bg-ink-900/70 px-5 py-2.5 text-ivory/85">{o}</span>)}
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 py-16 md:py-24 border-t border-gold-500/10 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-10">
            <Eyebrow>on répond à vos questions</Eyebrow>
            <Title>Questions fréquentes</Title>
          </Reveal>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl border border-gold-500/20 bg-ink-900/70 open:border-gold-500/50 transition-colors">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold text-ivory [&::-webkit-details-marker]:hidden">
                  <span>{q}</span>
                  <span className="text-gold-500 text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="px-6 pb-6 text-ivory/70 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* appel final */}
      <section className="relative px-5 py-20 md:py-28 border-t border-gold-500/10 text-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2),transparent_65%)]" />
        <Reveal className="relative max-w-2xl mx-auto">
          <span className="text-gold-500 text-3xl" aria-hidden="true">♥</span>
          <h2 className="font-display text-4xl sm:text-6xl leading-[1.05] mt-3 mb-4">Le moment parfait<br /><span className="gold-text">commence maintenant.</span></h2>
          <p className="text-ivory/70 text-lg mb-9">Composez votre LOVEBOX, envoyez le lien, et regardez l’émotion faire le reste.</p>
          <CTA />
          <p className="mt-8 text-xs tracking-[0.4em] text-gold-500/80 font-bold">CREATE THE MOMENT.</p>
        </Reveal>
      </section>

      {/* pied de page */}
      <footer className="px-5 py-10 border-t border-gold-500/15">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-ivory/55">
          <div className="flex items-center gap-2"><span className="text-gold-500" aria-hidden="true">♥</span><span className="font-display text-xl tracking-[0.14em] text-ivory">LOVEBOX</span></div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV.map(([href, label]) => <a key={href} href={href} className="hover:text-gold-400 transition-colors">{label}</a>)}
            <Link to={STUDIO} className="hover:text-gold-400 transition-colors">Créer ma LOVEBOX</Link>
          </nav>
          <p>© 2026 LOVEBOX</p>
        </div>
      </footer>
    </div>
  )
}
