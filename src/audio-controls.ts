import { Radio } from "./utils/radio-channels";

// Element references
const playPauseButton = document.getElementById("play-pause-button");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
const progressBar = document.getElementById("progress-bar");
const progressSlider = document.getElementById(
  "progress-slider"
) as HTMLInputElement;
const current = document.getElementById("current");
const duration = document.getElementById("duration");

// Track if audio is playing
let isPlaying = false; // Initialize as false

// Toggle play/pause on button click
playPauseButton?.addEventListener("click", () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

// Play audio and update UI
function playAudio() {
  audioPlayer?.play();
  isPlaying = true; // Set isPlaying to true
  playIcon?.classList.add("hidden");
  pauseIcon?.classList.remove("hidden");
  if (audioPlayer) {
    duration!.innerText = formatTime(audioPlayer.duration);
  }
  updateSlider();
  updateTime();
}

// Pause audio and update UI
function pauseAudio() {
  audioPlayer?.pause();
  isPlaying = false; // Set isPlaying to false
  playIcon?.classList.remove("hidden");
  pauseIcon?.classList.add("hidden");
}

// Update progress slider and bar
function updateSlider() {
  if (!isPlaying) {
    return;
  }
  if (!audioPlayer.duration) {
    return;
  }
  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  if (progressBar) {
    progressBar!.style.width = `${percentage}%`;
  }
  if (progressSlider) {
    progressSlider!.value = `${percentage}`;
  }
  requestAnimationFrame(updateSlider);
}

// Update current time display
function updateTime() {
  if (!audioPlayer.duration) {
    return;
  }
  if (current) {
    current!.innerHTML = formatTime(audioPlayer.currentTime);
  }
  requestAnimationFrame(updateTime);
}

// Seek audio based on slider value
function seekAudio(value: number) {
  if (audioPlayer.duration) {
    const time = (value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
  }
}

// Reset and play audio when it ends
audioPlayer?.addEventListener("ended", () => {
  audioPlayer.currentTime = 0;
  pauseAudio(); // Reset UI to pause state
});

// Helper function to format time as MM:SS
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Handle progress slider input change
progressSlider?.addEventListener("input", (event) => {
  const slider = event.target as HTMLInputElement;
  seekAudio(Number(slider.value));
});

async function getStations(tag: string) {
  return await new Radio().getStationsByTag(tag);
}

window.onload = async () => {
  const stations = await getStations("pop");
  console.log(stations);
  localStorage.setItem("stations", JSON.stringify(stations));
};
