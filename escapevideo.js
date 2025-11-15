    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
    import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

    // --- Configuración Firebase ---
    const firebaseConfig = {
      apiKey: "AIzaSyAwRuRAEiszBLwDajaDG51AI4HjMSe2Lh4",
      authDomain: "escape-room-g1.firebaseapp.com",
      databaseURL: "https://escape-room-g1-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "escape-room-g1",
      storageBucket: "escape-room-g1.firebasestorage.app",
      messagingSenderId: "652279185289",
      appId: "1:652279185289:web:ba75116458fdf92c092b58"
    };

    // --- Inicializa Firebase ---
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    const video = document.getElementById("video");
    const btn = document.getElementById("prepareBtn");
    const status = document.getElementById("status");

    let interactionAllowed = false;
    let pendingVideo = null;

    // --- Escucha el trigger remoto ---
    const triggerRef = ref(db, "trigger");
    onValue(triggerRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.video) {
        pendingVideo = data.video;
        console.log("🎯 Señal remota detectada:", pendingVideo);
        // Si ya se preparó la interacción, reproduce de inmediato
        if (interactionAllowed) playPendingVideo();
      }
    });

    // --- Al hacer clic el usuario ---
    btn.addEventListener("click", async () => {
      try {
  //      keepalive.play(); // mantiene activo el permiso de autoplay
        interactionAllowed = true;
        btn.style.display = "none";
        status.textContent = "Esperando señal del QR...";

        if (pendingVideo) {
          // Carga el vídeo real para obtener permiso de reproducción
          video.src = `${pendingVideo}.mp4`;
          video.muted = true;
          await video.play();
          video.pause();
          video.muted = false;
          console.log("🎬 Interacción registrada para", pendingVideo);
        } else {
          console.log("Esperando señal remota...");
        }
      } catch (err) {
        console.error("Error preparando video:", err);
      }
    });

    // --- Función para reproducir cuando llegue el trigger ---
    async function playPendingVideo() {
      if (!pendingVideo) return;
      try {
        video.src = `${pendingVideo}.mp4`;
        video.currentTime = 0;
        video.muted = false;
        
        // 🖥️ Intentar pantalla completa
  /*     if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          await video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
          await video.msRequestFullscreen();
        }
    */    
        await video.play();
        status.textContent = "";
        console.log("▶️ Reproduciendo:", pendingVideo);
      } catch (err) {
        console.error("Playback bloqueado:", err);
      }
    }

    // --- Limpia trigger al terminar ---
    video.addEventListener("ended", async () => {
      await set(triggerRef, null);
      console.log("🧹 Trigger limpiado tras finalizar vídeo.");
    });
