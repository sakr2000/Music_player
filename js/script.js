// load needed Dom elements
let container = document.querySelector(".container"),
  songImg = container.querySelector(".song-image img"),
  songName = container.querySelector(".song-info .name"),
  songArtist = container.querySelector(".song-info .artist"),
  songCurrentTime = container.querySelector(".time .current"),
  songTotalDuration = container.querySelector(".time .total"),
  audioElement = container.querySelector("#audio_player"),
  previousBtn = container.querySelector("#previous"),
  nextBtn = container.querySelector("#next"),
  repeatBtn = container.querySelector("#repeat"),
  showPlaylistBtn = container.querySelector("#show_playlist"),
  hidePlaylistBtn = container.querySelector("#hide_playlist"),
  playlist = container.querySelector(".playlist"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = container.querySelector(".progress-bar"),
  playPauseBtn = container.querySelector(".play-pause");

// options variables
let currentSongIndex = 2;

// load song information
function loadSong(index) {
  songName.innerHTML = allSongs[index].name;
  songArtist.innerHTML = allSongs[index].artist;
  songImg.src = allSongs[index].img_src;
  audioElement.src = allSongs[index].audio_src;
}
window.addEventListener("load", () => {
  loadSong(currentSongIndex);
});

playPauseBtn.addEventListener("click", () => {
  let isPaused = container.classList.contains("paused");
  isPaused ? playSong() : pauseSong();
});

function playSong() {
  container.classList.remove("paused");
  audioElement.play();
  playPauseBtn.querySelector("i").innerText = "pause";
}
function pauseSong() {
  container.classList.add("paused");
  audioElement.pause();
  playPauseBtn.querySelector("i").innerText = "play_arrow";
}
// precious button click event
function PreviousSong() {
  currentSongIndex == 0
    ? (currentSongIndex = allSongs.length)
    : currentSongIndex--;
  loadSong(currentSongIndex);
}
previousBtn.addEventListener("click", () => {
  PreviousSong();
  pauseSong();
  updateProgressBar(0, 5);
});
// next button click event
function nextSong() {
  currentSongIndex == allSongs.length - 1
    ? (currentSongIndex = 0)
    : currentSongIndex++;
  loadSong(currentSongIndex);
}
nextBtn.addEventListener("click", () => {
  nextSong();
  pauseSong();
  updateProgressBar(0, 5);
});

// progress area click
progressArea.addEventListener("click", (event) => {
  let areaWidth = progressArea.clientWidth;
  let offsetX = event.offsetX;
  let songDuration = audioElement.duration;

  audioElement.currentTime = Math.floor((offsetX / areaWidth) * songDuration);
});

// repeat button
repeatBtn.addEventListener("click", () => {
  let buttonValue = repeatBtn.innerText;

  switch (buttonValue) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Loop current song");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Shuffle playback");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Loop current playlist");
      break;
  }
});
// repeat events
audioElement.addEventListener("ended", () => {
  let buttonValue = repeatBtn.innerText;

  switch (buttonValue) {
    case "repeat":
      nextSong();
      playSong();
      break;
    case "repeat_one":
      audioElement.currentTime = 0;
      playSong();
      break;
    case "shuffle":
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allSongs.length);
      } while (randomIndex == currentSongIndex);
      currentSongIndex = randomIndex;
      loadSong(currentSongIndex);
      playSong();
      break;
  }
});

// audio time updates
audioElement.addEventListener("timeupdate", (event) => {
  // update progress bar
  let currentTime = event.target.currentTime;
  let totalDuration = event.target.duration;
  updateProgressBar(currentTime, totalDuration);
  // update current time
  let totalMin = Math.floor(currentTime / 60);
  let totalSec = Math.floor(currentTime % 60);
  totalMin = totalMin < 10 ? `0${totalMin}` : totalMin;
  totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
  songCurrentTime.innerHTML = `${totalMin}:${totalSec}`;
});
// display song total time
audioElement.addEventListener("loadeddata", () => {
  let audioDuration = audioElement.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
  totalMin = totalMin < 10 ? `0${totalMin}` : totalMin;
  totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
  songTotalDuration.innerHTML = `${totalMin}:${totalSec}`;
});

function updateProgressBar(current, duration) {
  progressBar.style.width = `${(current / duration) * 100}%`;
}

// show or hide playlist
showPlaylistBtn.addEventListener("click", () => {
  playlist.classList.toggle("show");
});
hidePlaylistBtn.addEventListener("click", () => {
  playlist.classList.toggle("show");
});
