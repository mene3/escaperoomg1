  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAwRuRAEiszBLwDajaDG51AI4HjMSe2Lh4",
    authDomain: "escape-room-g1.firebaseapp.com",
    databaseURL: "https://escape-room-g1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "escape-room-g1",
    storageBucket: "escape-room-g1.firebasestorage.app",
    messagingSenderId: "652279185289",
    appId: "1:652279185289:web:ba75116458fdf92c092b58"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

   // Extraer parámetro de la URL, ej: ?video=video2
  const params = new URLSearchParams(window.location.search);
  const videoName = params.get("video") || "video1"; // valor por defecto
  const imageName = params.get("image") || "imagen1";

// 🔹 Referencias a elementos del DOM
const mensaje = document.getElementById("mensaje");
const imagen = document.getElementById("imagen");

// 🔹 Muestra el mensaje en pantalla
// mensaje.textContent = `Vídeo solicitado: ${videoName}`;

// 🔹 Si existe parámetro "image", la muestra en pantalla
if (imageName) {
  // Puedes cambiar esta ruta según tu estructura
  imagen.src = `images/${imageName}.png`; // o .png según tus archivos
  imagen.style.display = "block";
} else {
  imagen.style.display = "none";
}
    
  await set(ref(db, "trigger"), { video: videoName, timestamp: Date.now() });
  console.log(`✅ Trigger enviado correctamente  ${videoName}`);
