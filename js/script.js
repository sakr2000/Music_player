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
let currentSongIndex = Math.floor(Math.random() * allSongs.length);

// load song information
function loadSong(index) {
  songName.innerHTML = allSongs[index].name;
  songArtist.innerHTML = allSongs[index].artist;
  songImg.src = allSongs[index].img_src;
  audioElement.src = allSongs[index].audio_src;
  playingNow();
}
window.addEventListener("load", () => {
  loadSong(currentSongIndex);
});

playPauseBtn.addEventListener("click", () => {
  let isPaused = container.classList.contains("paused");
  isPaused ? playSong() : pauseSong();
});
// play loaded song
function playSong() {
  container.classList.remove("paused");
  audioElement.play();
  playPauseBtn.querySelector("i").innerText = "pause";
}

// pause loaded song
function pauseSong() {
  container.classList.add("paused");
  audioElement.pause();
  playPauseBtn.querySelector("i").innerText = "play_arrow";
}

// play/pause when space key is pressed
document.addEventListener(
  "keyup",
  (event) => {
    let isPaused = container.classList.contains("paused");
    var code = event.code;

    if (code == "Space" && isPaused) {
      playSong();
    } else if (code == "Space" && !isPaused) {
      pauseSong();
    }
  },
  false
);

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
  totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
  songCurrentTime.innerHTML = `${totalMin}:${totalSec}`;
});

// display song total time
audioElement.addEventListener("loadeddata", () => {
  let audioDuration = audioElement.duration;
  let totalMin = Math.floor(audioDuration / 60);
  let totalSec = Math.floor(audioDuration % 60);
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

// add playlist songs
let ulTag = container.querySelector(".playlist ul");
for (let i = 0; i < allSongs.length; i++) {
  let tempLi = `          
  <li>
  <div class="row">
    <span>${allSongs[i].name}</span>
    <p>${allSongs[i].artist}</p>
  </div>
  <audio src="${allSongs[i].audio_src}" id="liAudio-${i}"></audio>
  <span class="audio-duration" id="liAudioDuration_${i}">03:42</span>
  <div class="playing-bars">
  <span> </span>
  <span> </span>
  <span> </span>
</div>
</li>`;
  ulTag.insertAdjacentHTML("beforeend", tempLi);

  let liAudio = ulTag.querySelector(`#liAudio-${i}`);
  liAudio.addEventListener("loadeddata", () => {
    let audioDuration = liAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    totalSec = totalSec < 10 ? `0${totalSec}` : totalSec;
    ulTag.querySelector(
      `#liAudioDuration_${i}`
    ).innerHTML = `${totalMin}:${totalSec}`;
  });
}

// playlist items click event
let liArray = ulTag.querySelectorAll("li");
liArray.forEach((Element, index) => {
  Element.addEventListener("click", () => {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    playSong();
  });
});

// show the playing song in the playlist
function playingNow() {
  for (let i = 0; i < liArray.length; i++) {
    if (i == currentSongIndex) {
      liArray[i].classList.add("playing");
    }
    if (liArray[i].classList.contains("playing") && i != currentSongIndex) {
      liArray[i].classList.remove("playing");
    }
  }
}

// song volume change
let volumeBar = container.querySelector(".volume-bar #volume");
volumeBar.addEventListener("change", (e) => {
  audioElement.volume = e.target.value / 100;
});
