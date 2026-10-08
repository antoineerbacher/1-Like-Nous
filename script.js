/* ========================================
   ELEMENTS
======================================== */

const entryPage = document.getElementById("entryPage");
const playerPage = document.getElementById("playerPage");

const enterButton = document.getElementById("enterButton");
const backButton = document.getElementById("backButton");

const audio = document.getElementById("song");

const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const restartButton = document.getElementById("restartButton");

const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");

const visualizer = document.getElementById("visualizer");
const audioError = document.getElementById("audioError");


/* ========================================
   VISUALISEUR
======================================== */

const BAR_COUNT = 32;

for (let i = 0; i < BAR_COUNT; i++) {

    const bar = document.createElement("span");

    const baseHeight = 7 + ((i * 11) % 20);
    const opacity = 0.35 + ((i % 7) / 12);

    bar.style.height = `${baseHeight}px`;
    bar.style.opacity = opacity;

    visualizer.appendChild(bar);
}


/* ========================================
   FORMAT DU TEMPS
======================================== */

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}


/* ========================================
   NAVIGATION
======================================== */

enterButton.addEventListener("click", () => {

    entryPage.classList.add("hidden");
    playerPage.classList.remove("hidden");

});


backButton.addEventListener("click", () => {

    audio.pause();

    entryPage.classList.remove("hidden");
    playerPage.classList.add("hidden");

});


/* ========================================
   AUDIO INITIAL
======================================== */

audio.volume = 0.82;


/* ========================================
   METADONNEES AUDIO
======================================== */

audio.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent = formatTime(audio.duration);

    progressBar.max = audio.duration;
    progressBar.value = 0;

});


/* ========================================
   PLAY / PAUSE
======================================== */

async function togglePlay() {

    try {

        if (audio.paused) {

            await audio.play();

        } else {

            audio.pause();

        }

    } catch (error) {

        console.error(
            "Impossible de lancer la lecture audio :",
            error
        );

        audioError.classList.remove("hidden");

    }
}


playButton.addEventListener("click", togglePlay);


/* ========================================
   ETAT LECTURE
======================================== */

audio.addEventListener("play", () => {

    playIcon.textContent = "❚❚";

    playButton.setAttribute(
        "aria-label",
        "Mettre la chanson en pause"
    );

    visualizer.classList.add("playing");

});


audio.addEventListener("pause", () => {

    playIcon.textContent = "▶";

    playButton.setAttribute(
        "aria-label",
        "Lire la chanson"
    );

    visualizer.classList.remove("playing");

});


/* ========================================
   PROGRESSION
======================================== */

audio.addEventListener("timeupdate", () => {

    if (!Number.isFinite(audio.duration)) {
        return;
    }

    progressBar.value = audio.currentTime;

    currentTimeDisplay.textContent =
        formatTime(audio.currentTime);

});


progressBar.addEventListener("input", () => {

    const newTime = Number(progressBar.value);

    if (Number.isFinite(newTime)) {

        audio.currentTime = newTime;

        currentTimeDisplay.textContent =
            formatTime(newTime);

    }

});


/* ========================================
   RECOMMENCER
======================================== */

restartButton.addEventListener("click", async () => {

    audio.currentTime = 0;

    progressBar.value = 0;

    currentTimeDisplay.textContent = "0:00";

    try {

        await audio.play();

    } catch (error) {

        console.error(
            "Impossible de relancer la chanson :",
            error
        );

        audioError.classList.remove("hidden");

    }

});


/* ========================================
   VOLUME
======================================== */

volumeSlider.addEventListener("input", () => {

    const newVolume = Number(volumeSlider.value);

    if (
        Number.isFinite(newVolume) &&
        newVolume >= 0 &&
        newVolume <= 1
    ) {

        audio.volume = newVolume;

    }

});


/* ========================================
   FIN DE LA CHANSON
======================================== */

audio.addEventListener("ended", () => {

    playIcon.textContent = "▶";

    visualizer.classList.remove("playing");

    progressBar.value = 0;

    audio.currentTime = 0;

    currentTimeDisplay.textContent = "0:00";

});


/* ========================================
   ERREUR DE CHARGEMENT
======================================== */

audio.addEventListener("error", () => {

    console.error(
        "Le fichier audio n'a pas pu être chargé."
    );

    audioError.classList.remove("hidden");

});


/* ========================================
   CLAVIER
======================================== */

document.addEventListener("keydown", (event) => {

    if (playerPage.classList.contains("hidden")) {
        return;
    }

    if (event.code === "Space") {

        event.preventDefault();

        togglePlay();

    }

});
