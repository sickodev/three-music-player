const audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
const previous = document.getElementById(
  "previous-button"
) as HTMLButtonElement;
const next = document.getElementById("next-button") as HTMLButtonElement;

const stations = JSON.parse(localStorage.getItem("stations")!);
let index = 0;
console.log(stations);

previous.onclick = () => {
  if (index > 0) {
    index--;
  } else {
    previous.classList.add("opacity-0");
  }

  audioPlayer.src = stations[index];
};

next.onclick = () => {
  if (index > stations.length) {
    index--;
  }

  audioPlayer.src = stations[index];
};
