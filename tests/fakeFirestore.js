// Firestore en memoire, juste assez pour les fonctions api/.
export function createFakeDb(initial = {}) {
  const store = new Map(Object.entries(initial))
  let autoId = 0

  const snapshot = (path) => ({
    exists: store.has(path),
    data: () => (store.has(path) ? { ...store.get(path) } : undefined),
  })

  const docRef = (path) => ({
    id: path.split('/').pop(),
    path,
    collection: (name) => collectionRef(`${path}/${name}`),
    get: async () => snapshot(path),
  })

  const collectionRef = (path) => ({
    doc: (id) => docRef(`${path}/${id ?? `AutoId${String(++autoId).padStart(10, '0')}`}`),
  })

  const update = (ref, data) => {
    if (!store.has(ref.path)) throw new Error(`No document: ${ref.path}`)
    store.set(ref.path, { ...store.get(ref.path), ...data })
  }

  return {
    store,
    collection: collectionRef,
    batch: () => {
      const ops = []
      return {
        set: (ref, data) => ops.push(() => store.set(ref.path, { ...data })),
        commit: async () => ops.forEach((op) => op()),
      }
    },
    runTransaction: async (fn) => {
      const writes = []
      const result = await fn({
        get: async (ref) => snapshot(ref.path),
        update: (ref, data) => writes.push(() => update(ref, data)),
      })
      writes.forEach((w) => w())
      return result
    },
  }
}

export function mockRes() {
  const res = { statusCode: 200, headers: {}, body: undefined }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (body) => { res.body = body; return res }
  res.end = () => res
  res.setHeader = (k, v) => { res.headers[k] = v }
  return res
}
