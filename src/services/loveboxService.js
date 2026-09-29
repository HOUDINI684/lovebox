import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

// La creation passe par /api/initialize-payment : le client n'ecrit plus dans Firestore.
export async function getLovebox(loveboxId) {
  try {
    const snap = await getDoc(doc(db, 'loveboxes', loveboxId))
    if (!snap.exists()) throw new Error('LOVEBOX introuvable')
    return snap.data()
  } catch (error) {
    // Les regles Firestore refusent la lecture tant que le paiement n'est pas confirme.
    if (error.code === 'permission-denied') throw new Error("Cette LOVEBOX n'est pas encore disponible.")
    throw error
  }
}
