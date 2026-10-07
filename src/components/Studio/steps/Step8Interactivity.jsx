import { useStudio } from '../../../hooks/useStudio'
import StepNav from '../StepNav'
import { getCompleteQuiz, MIN_QUIZ_QUESTIONS } from '../../../utils/quiz'

const PRESET_QUIZ_QUESTIONS = [
  'Où nous sommes-nous rencontrés pour la première fois ?',
  'Quelle est notre chanson ?',
  'Quel est mon plat préféré que tu cuisines (ou que je commande toujours) ?',
  'Quelle est la première chose que tu as remarquée chez moi ?',
  'Quel est notre endroit préféré ensemble ?',
  'Quelle est la date de notre premier rendez-vous ?',
  'Quel surnom me donnes-tu (ou aimerais-tu me donner) ?',
  'Quel film/série avons-nous regardé en boucle ?',
  'Quelle est notre plus grande fierté commune ?',
  "Qu'est-ce qui te fait le plus rire chez moi ?",
  'Quel est le souvenir de voyage qui te marque le plus ?',
  'Quelle est ma couleur préférée ?',
  'Quel est notre running gag (notre private joke) ?',
  "Qu'est-ce que tu préfères dans notre relation ?",
  'Si on devait résumer notre histoire en un mot, lequel ?',
]

const PRESET_THOUGHTS = [
  'Chaque jour, une petite pensée pour toi.',
  "Reviens quand tu veux — ce petit coin t'appartient.",
  "Un sourire de plus aujourd'hui, grâce à ça ?",
  "Ce souvenir ne s'efface pas, même en revenant souvent.",
  'Prends un instant, rien que pour toi.',
  'Tu comptes plus que tu ne le penses.',
  "Aujourd'hui aussi, quelqu'un pense à toi.",
  'Respire. Cet endroit est fait pour toi.',
  'Un peu de douceur dans ta journée.',
  'Certaines personnes restent, même loin des yeux.',
  "Ce lien ne demande rien, juste d'exister.",
  "Merci d'être qui tu es.",
  'Une pensée, un sourire, un instant pour toi.',
  "Tu mérites qu'on pense à toi comme ça.",
  "Ce moment t'appartient, autant de fois que tu veux.",
]

export default function Step8Interactivity() {
  const { studioData, updateField } = useStudio()

  const toggleQuizPreset = (text) => {
    const exists = studioData.quizQuestions.some((q) => q.question === text)
    if (exists) {
      updateField('quizQuestions', studioData.quizQuestions.filter((q) => q.question !== text))
    } else {
      updateField('quizQuestions', [...studioData.quizQuestions, { question: text, answer: '', wrongAnswer: '' }])
    }
  }
  const addCustomQuiz = () => {
    updateField('quizQuestions', [...studioData.quizQuestions, { question: '', answer: '', wrongAnswer: '' }])
  }
  const updateQuiz = (i, field, value) => {
    const next = studioData.quizQuestions.map((q, idx) => (idx === i ? { ...q, [field]: value } : q))
    updateField('quizQuestions', next)
  }
  const removeQuiz = (i) => {
    updateField('quizQuestions', studioData.quizQuestions.filter((_, idx) => idx !== i))
  }

  const toggleThoughtPreset = (text) => {
    const exists = studioData.dailyThoughts.includes(text)
    if (exists) {
      updateField('dailyThoughts', studioData.dailyThoughts.filter((t) => t !== text))
    } else {
      updateField('dailyThoughts', [...studioData.dailyThoughts, text])
    }
  }
  const addCustomThought = () => {
    updateField('dailyThoughts', [...studioData.dailyThoughts, ''])
  }
  const updateThought = (i, value) => {
    const next = studioData.dailyThoughts.map((t, idx) => (idx === i ? value : t))
    updateField('dailyThoughts', next)
  }
  const removeThought = (i) => {
    updateField('dailyThoughts', studioData.dailyThoughts.filter((_, idx) => idx !== i))
  }

  const completeCount = getCompleteQuiz(studioData.quizQuestions).length

  return (
    <div>
      <h2 className="font-display text-3xl text-ivory mb-1">Rendez-la interactive</h2>
      <p className="text-ivory/40 mb-8">Tout est optionnel — cochez ce qui vous parle, ou écrivez le vôtre.</p>

      {/* Quiz complicité */}
      <div className="mb-8">
        <h3 className="font-display text-lg text-ivory mb-1">Quiz de complicité</h3>
        <p className="text-ivory/40 text-sm mb-2">Cochez les questions qui vous parlent, puis écrivez la bonne réponse. Le destinataire répondra par Vrai ou Faux.</p>
        <p className={`text-xs mb-3 ${completeCount >= MIN_QUIZ_QUESTIONS ? 'text-gold-400' : 'text-ivory/40'}`}>
          {completeCount >= MIN_QUIZ_QUESTIONS
            ? `✓ ${completeCount} questions prêtes — l'onglet Quiz sera affiché`
            : `Il faut au moins ${MIN_QUIZ_QUESTIONS} questions complètes (question + réponse) pour que l'onglet Quiz s'affiche. Pour l'instant : ${completeCount}.`}
        </p>

        <div className="grid gap-1.5 mb-3">
          {PRESET_QUIZ_QUESTIONS.map((text) => {
            const checked = studioData.quizQuestions.some((q) => q.question === text)
            return (
              <label key={text} className="flex items-start gap-2 text-sm text-ivory/70 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={() => toggleQuizPreset(text)} className="mt-0.5" />
                {text}
              </label>
            )
          })}
        </div>

        {studioData.quizQuestions.map((q, i) => {
          const missingAnswer = q.question.trim() && !q.answer.trim()
          const missingQuestion = !q.question.trim() && q.answer.trim()
          return (
            <div key={i} className="bg-ink-800 border border-gold-500/20 rounded-xl p-3 mb-2 flex flex-col gap-1.5">
              <div className="flex gap-2 items-start">
                <input type="text" value={q.question} onChange={(e) => updateQuiz(i, 'question', e.target.value)} placeholder="Question" className="flex-1 bg-transparent text-ivory text-sm px-1 py-1 focus:outline-none placeholder:text-ivory/25 border-b border-gold-500/10" />
                <button onClick={() => removeQuiz(i)} className="text-ivory/30 text-xs px-1">✕</button>
              </div>
              <input type="text" value={q.answer} onChange={(e) => updateQuiz(i, 'answer', e.target.value)} placeholder="Bonne réponse" className="bg-transparent text-ivory text-sm px-1 py-1 focus:outline-none placeholder:text-ivory/25 border-b border-gold-500/10" />
              <input type="text" value={q.wrongAnswer || ''} onChange={(e) => updateQuiz(i, 'wrongAnswer', e.target.value)} placeholder="Fausse réponse (facultatif)" className="bg-transparent text-ivory text-sm px-1 py-1 focus:outline-none placeholder:text-ivory/25" />
              {missingAnswer && <p className="text-danger text-xs">⚠️ réponse manquante — cette question sera ignorée</p>}
              {missingQuestion && <p className="text-danger text-xs">⚠️ question manquante — cette ligne sera ignorée</p>}
            </div>
          )
        })}
        <button onClick={addCustomQuiz} type="button" className="text-gold-400 text-sm font-medium mt-1">+ Ajouter ma propre question</button>
      </div>

      {/* Pensées du jour */}
      <div>
        <h3 className="font-display text-lg text-ivory mb-1">Pensées du jour</h3>
        <p className="text-ivory/40 text-sm mb-3">Une phrase différente à chaque fois qu'iel revient consulter sa LOVEBOX.</p>

        <div className="grid gap-1.5 mb-3">
          {PRESET_THOUGHTS.map((text) => {
            const checked = studioData.dailyThoughts.includes(text)
            return (
              <label key={text} className="flex items-start gap-2 text-sm text-ivory/70 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={() => toggleThoughtPreset(text)} className="mt-0.5" />
                {text}
              </label>
            )
          })}
        </div>

        {studioData.dailyThoughts.map((t, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input type="text" value={t} onChange={(e) => updateThought(i, e.target.value)} placeholder="Je pense à toi aujourd'hui..." maxLength={100} className="flex-1 px-3 py-2 rounded-lg border border-gold-500/20 bg-ink-800 text-ivory text-sm focus:outline-none placeholder:text-ivory/25" />
            <button onClick={() => removeThought(i)} className="text-ivory/30 text-xs px-1">✕</button>
          </div>
        ))}
        <button onClick={addCustomThought} type="button" className="text-gold-400 text-sm font-medium mt-1">+ Ajouter ma propre pensée</button>
      </div>

      <StepNav />
    </div>
  )
}
