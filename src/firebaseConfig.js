import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAbv9QpQJUw4RdwSILBBE44IOoFdrCokD4",
    authDomain: "chave-valor-a5b7e.firebaseapp.com",
    databaseURL: "https://chave-valor-a5b7e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chave-valor-a5b7e",
    storageBucket: "chave-valor-a5b7e.appspot.com",
    messagingSenderId: "629180601060",
    appId: "1:629180601060:web:b899dfc70851a3493a12f1",
    measurementId: "G-G54J0E3WTX"
};

const app = initializeApp(firebaseConfig);
// Obtém o banco de dados
const database = getDatabase(app);
export { database };
