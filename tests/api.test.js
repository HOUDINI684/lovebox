import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFakeDb, mockRes } from './fakeFirestore.js'

let db
const sendMail = vi.fn(async () => {})
vi.mock('../api/_firebaseAdmin.js', () => ({ getDb: () => db }))
vi.mock('../api/_mailer.js', () => ({ sendMail: (...a) => sendMail(...a) }))

const { confirmPayment } = await import('../api/_payment.js')
const webhook = (await import('../api/flutterwave-webhook.js')).default
const heartTouched = (await import('../api/heart-touched.js')).default
const initializePayment = (await import('../api/initialize-payment.js')).default

const ID = 'AbCdEfGhIj0123456789'
const TX_REF = `lovebox_${ID}_1700000000000`

function seed({ paid = false, heartTouched = false } = {}) {
  db = createFakeDb({
    [`loveboxes/${ID}`]: { id: ID, recipientName: '<b>Awa</b>', paid, heartTouched },
    [`loveboxes/${ID}/private/meta`]: { txRef: TX_REF, amount: 9999, currency: 'XOF', recipientEmail: 'r@x.com', creatorEmail: 'c@x.com' },
  })
}

function mockFlutterwave(tx) {
  global.fetch = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: tx }) }))
}

const goodTx = { id: 42, status: 'successful', tx_ref: TX_REF, amount: 9999, currency: 'XOF' }

beforeEach(() => {
  sendMail.mockClear()
  process.env.APP_URL = 'https://lovebox.app'
  process.env.FLW_SECRET_HASH = 'secret-hash'
})

describe('confirmPayment', () => {
  it('marque payee et envoie les emails une seule fois', async () => {
    seed(); mockFlutterwave(goodTx)
    expect(await confirmPayment('42')).toEqual({ paid: true, loveboxId: ID })
    expect(db.store.get(`loveboxes/${ID}`).paid).toBe(true)
    expect(sendMail).toHaveBeenCalledTimes(2)
    expect(sendMail.mock.calls[0][0].html).toContain('&lt;b&gt;Awa&lt;/b&gt;')

    await confirmPayment('42')
    expect(sendMail).toHaveBeenCalledTimes(2)
  })

  it('refuse un montant insuffisant', async () => {
    seed(); mockFlutterwave({ ...goodTx, amount: 1 })
    expect((await confirmPayment('42')).paid).toBe(false)
    expect(db.store.get(`loveboxes/${ID}`).paid).toBe(false)
  })

  it('refuse une autre devise', async () => {
    seed(); mockFlutterwave({ ...goodTx, currency: 'NGN' })
    expect((await confirmPayment('42')).paid).toBe(false)
  })

  it('refuse un tx_ref different de celui enregistre', async () => {
    seed(); mockFlutterwave({ ...goodTx, tx_ref: `lovebox_${ID}_1` })
    expect((await confirmPayment('42')).paid).toBe(false)
  })

  it('refuse une transaction non aboutie', async () => {
    seed(); mockFlutterwave({ ...goodTx, status: 'failed' })
    expect((await confirmPayment('42')).paid).toBe(false)
  })
})

describe('flutterwave-webhook', () => {
  it('rejette une signature invalide', async () => {
    seed(); mockFlutterwave(goodTx)
    const res = mockRes()
    await webhook({ method: 'POST', headers: { 'verif-hash': 'faux' }, body: { event: 'charge.completed', data: { id: 42 } } }, res)
    expect(res.statusCode).toBe(401)
    expect(db.store.get(`loveboxes/${ID}`).paid).toBe(false)
  })

  it('confirme avec une signature valide', async () => {
    seed(); mockFlutterwave(goodTx)
    const res = mockRes()
    await webhook({ method: 'POST', headers: { 'verif-hash': 'secret-hash' }, body: { event: 'charge.completed', data: { id: 42 } } }, res)
    expect(res.body).toEqual({ paid: true })
  })
})

describe('heart-touched', () => {
  const call = async () => {
    const res = mockRes()
    await heartTouched({ method: 'POST', headers: {}, body: { loveboxId: ID } }, res)
    return res
  }

  it('refuse une LOVEBOX non payee', async () => {
    seed()
    expect((await call()).statusCode).toBe(404)
  })

  it("n'envoie qu'une notification meme si appele en boucle", async () => {
    seed({ paid: true })
    await call(); await call(); await call()
    expect(sendMail).toHaveBeenCalledTimes(1)
    expect(sendMail.mock.calls[0][0].to).toBe('c@x.com')
  })
})

describe('initialize-payment', () => {
  it('cree la LOVEBOX non payee, stocke les emails en prive et prend le prix serveur', async () => {
    db = createFakeDb()
    global.fetch = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: { link: 'https://pay.flw/x' } }) }))
    const res = mockRes()
    await initializePayment({ method: 'POST', headers: {}, body: { lovebox: {
      tier: 'premium', recipientName: 'Awa', recipientEmail: 'a@x.com', creatorEmail: 'c@x.com',
      photos: [{ url: 'https://res.cloudinary.com/demo/image/upload/a.jpg' }], amount: 1,
    } } }, res)

    expect(res.body.paymentLink).toBe('https://pay.flw/x')
    const id = res.body.loveboxId
    expect(db.store.get(`loveboxes/${id}`)).toMatchObject({ paid: false, tier: 'premium' })
    expect(db.store.get(`loveboxes/${id}`)).not.toHaveProperty('recipientEmail')
    expect(db.store.get(`loveboxes/${id}/private/meta`)).toMatchObject({ amount: 9999, creatorEmail: 'c@x.com' })
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).amount).toBe(9999)
  })

  it('renvoie 400 sur des donnees invalides', async () => {
    db = createFakeDb()
    const res = mockRes()
    await initializePayment({ method: 'POST', headers: {}, body: { lovebox: { tier: 'x' } } }, res)
    expect(res.statusCode).toBe(400)
  })

  it("n'autorise en CORS que l'origine de l'application", async () => {
    const res = mockRes()
    await initializePayment({ method: 'OPTIONS', headers: { origin: 'https://evil.com' } }, res)
    expect(res.headers['Access-Control-Allow-Origin']).toBeUndefined()
    const ok = mockRes()
    await initializePayment({ method: 'OPTIONS', headers: { origin: 'https://lovebox.app' } }, ok)
    expect(ok.headers['Access-Control-Allow-Origin']).toBe('https://lovebox.app')
  })
})
