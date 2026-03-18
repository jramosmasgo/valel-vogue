# ===================================================
# Variables de entorno para la Serverless Function (api/og/[id].ts)
# Estas usan Firebase Admin SDK (acceso server-side a Firestore)
# ===================================================

# Estas 3 variables son DISTINTAS a las VITE_ del frontend.
# Las obtienes en: Firebase Console → Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada

FIREBASE_PROJECT_ID=valel-vogue
FIREBASE_CLIENT_EMAIL=<pega aquí el client_email del JSON descargado>
FIREBASE_PRIVATE_KEY=<pega aquí el private_key del JSON descargado, reemplazando \n por literales>

# Importante: subir estas variables al panel de Vercel también
# Panel de Vercel → Tu proyecto → Settings → Environment Variables
