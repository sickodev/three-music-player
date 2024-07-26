const playPauseButton = document.getElementById("playPauseButton");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
const progressBar = document.getElementById("progress-bar");
const progressSlider = document.getElementById(
  "progress-slider"
) as HTMLInputElement;

const current = document.getElementById("current");
const duration = document.getElementById("duration");
let isPlaying = false;

playPauseButton?.addEventListener("click", () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
});

function playAudio() {
  audioPlayer?.play();
  isPlaying = true;
  playIcon?.classList.add("hidden");
  pauseIcon?.classList.remove("hidden");
  duration!.innerText = formatTime(audioPlayer.duration);
  updateSlider();
  updateTime();
}

function pauseAudio() {
  audioPlayer?.pause();
  isPlaying = true;
  playIcon?.classList.remove("hidden");
  pauseIcon?.classList.add("hidden");
}

function updateSlider() {
  if (!isPlaying) {
    return;
  }
  if (!audioPlayer.duration) {
    return;
  }
  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar!.style.width = `${percentage}%`;
  progressSlider!.value = `${percentage}`;
  requestAnimationFrame(updateSlider);
}

function updateTime() {
  if (!audioPlayer.duration) {
    return;
  }
  current!.innerHTML = formatTime(audioPlayer.currentTime);
  requestAnimationFrame(updateTime);
}

function seekAudio(value: number) {
  const time = (value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = time;
}

audioPlayer?.addEventListener("ended", () => {
  audioPlayer.currentTime = 0;
  playAudio();
});

//helper function
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  // Pad minutes and seconds with leading zeros if necessary
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
