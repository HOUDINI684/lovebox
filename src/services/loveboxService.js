import { doc, setDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function createLovebox(studioData) {
  const ref = doc(collection(db, 'loveboxes'))
  const payload = { ...studioData, id: ref.id, heartTouched: false, createdAt: serverTimestamp() }
  await setDoc(ref, payload)
  return ref.id
}

export async function getLovebox(loveboxId) {
  const ref = doc(db, 'loveboxes', loveboxId)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('LOVEBOX introuvable')
  return snap.data()
}
