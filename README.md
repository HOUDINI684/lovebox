# LOVEBOX

Plateforme de cadeaux emotionnels digitaux pour l'Afrique francophone.

## Demarrage

npm install
cp .env.example .env
npm run dev

## Stack

React + Vite, Firebase Firestore, Cloudinary (medias), Vercel Functions (paiement/emails), Tailwind CSS.

## Scripts

npm run lint    # ESLint
npm test        # Vitest (validation partagee + fonctions api/)
npm run build

## Flux de paiement

1. Le Studio envoie le contenu a `/api/initialize-payment`, qui le valide (`shared/lovebox.js`),
   cree la LOVEBOX avec `paid: false` et renvoie le lien Flutterwave. Le montant est fixe par le serveur.
2. Flutterwave confirme via le webhook `/api/flutterwave-webhook` et redirige vers `/paiement/retour`,
   qui appelle `/api/verify-payment`. Les deux re-verifient la transaction (statut, montant, devise, tx_ref)
   et sont idempotents.
3. Le destinataire ne peut lire la LOVEBOX qu'une fois payee (regles Firestore).

## Donnees Firestore

- `loveboxes/{id}` : contenu public (lisible par ID seulement si `paid == true`).
- `loveboxes/{id}/private/meta` : emails, tx_ref, montant. Jamais lisible par le client.

Le client n'ecrit jamais dans Firestore : tout passe par les fonctions `api/` (Admin SDK).

## Mise en production

- Variables serveur : voir la section « Serveur » de `.env.example`.
- Flutterwave > Settings > Webhooks : URL `https://<domaine>/api/flutterwave-webhook`, secret hash = `FLW_SECRET_HASH`.
- Deployer les regles : `firebase deploy --only firestore:rules`.
