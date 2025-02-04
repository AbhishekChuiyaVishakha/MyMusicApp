// Play song function
const audioPlayer = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const currentSong = document.getElementById("current-song");
const stopBtn = document.getElementById("stop-btn");

function playSong(title, url) {
    audioSource.src = url;
    audioPlayer.load();
    audioPlayer.play();
    currentSong.innerText = title;
}

stopBtn.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    currentSong.innerText = "No song playing";
});
