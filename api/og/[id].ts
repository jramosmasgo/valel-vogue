import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

// User-agents of bots that scrape Open Graph tags
const BOT_AGENTS = [
    'whatsapp',
    'facebookexternalhit',
    'twitterbot',
    'telegrambot',
    'linkedinbot',
    'slackbot',
    'discordbot',
];

function isBot(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    return BOT_AGENTS.some((bot) => ua.includes(bot));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { id } = req.query;
    const userAgent = req.headers['user-agent'] || '';

    // If it's a regular user, redirect to the React SPA
    if (!isBot(userAgent)) {
        res.setHeader('Location', `/producto/${id}`);
        return res.status(302).end();
    }

    try {
        // Fetch product from Firestore
        const docRef = db.collection('products').doc(id as string);
        const snap = await docRef.get();

        if (!snap.exists) {
            return res.status(404).send('Product not found');
        }

        const product = snap.data()!;
        const title = product.name ?? 'Valel Vogue';
        const price = product.price ? `S/. ${Number(product.price).toFixed(2)}` : '';
        const description = product.description
            ? product.description
            : `${title} — ${price} | Valel Vogue`;
        const image = product.image ?? 'https://valel-vogue.vercel.app/logo-white.png';
        const url = `https://valel-vogue.vercel.app/producto/${id}`;

        const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Valel Vogue</title>

    <!-- Open Graph / WhatsApp / Facebook -->
    <meta property="og:type"          content="product" />
    <meta property="og:url"           content="${url}" />
    <meta property="og:title"         content="${title} | Valel Vogue" />
    <meta property="og:description"   content="${description}" />
    <meta property="og:image"         content="${image}" />
    <meta property="og:image:width"   content="1200" />
    <meta property="og:image:height"  content="630" />
    <meta property="og:site_name"     content="Valel Vogue" />
    <meta property="og:locale"        content="es_PE" />

    <!-- Twitter Card -->
    <meta name="twitter:card"         content="summary_large_image" />
    <meta name="twitter:title"        content="${title} | Valel Vogue" />
    <meta name="twitter:description"  content="${description}" />
    <meta name="twitter:image"        content="${image}" />

    <!-- Redirect the actual browser to the SPA -->
    <meta http-equiv="refresh" content="0; url=${url}" />
  </head>
  <body>
    <p>Redirigiendo a <a href="${url}">${title}</a>...</p>
  </body>
</html>`;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        return res.status(200).send(html);
    } catch (err) {
        console.error('OG handler error:', err);
        return res.status(500).send('Internal server error');
    }
}
