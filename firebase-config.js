// ============================================================
// CONFIGURACIÓN DE FIREBASE (con variables de entorno)
// ============================================================

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA-ovAJtWllZAhqgQkmUriCyEI9ad7MqsM",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gacha-infinita.firebaseapp.com",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gacha-infinita",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gacha-infinita.firebasestorage.app",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "564611827872",
    appId: process.env.VITE_FIREBASE_APP_ID || "1:564611827872:web:c74a0a7a34f82b4f2ce1c5"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================================
// APP CHECK (reCAPTCHA v3)
// ============================================================
// La site key de reCAPTCHA v3 (obtenida de Google)
const RECAPTCHA_SITE_KEY = "6LdsjZUsAAAAAFNogpL5d5UUdiEkLKBxvM2Q6v3c"; // REEMPLAZA CON TU SITE KEY

// Inicializar App Check
const appCheck = firebase.appCheck();
appCheck.activate(RECAPTCHA_SITE_KEY, true); // true = token automático
