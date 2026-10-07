export const MIN_QUIZ_QUESTIONS = 2

// Ne garde que les questions completes (question + bonne reponse renseignees)
export function getCompleteQuiz(questions) {
  return (questions || []).filter((q) => q && q.question?.trim() && q.answer?.trim())
}

export function hasPlayableQuiz(questions) {
  return getCompleteQuiz(questions).length >= MIN_QUIZ_QUESTIONS
}
