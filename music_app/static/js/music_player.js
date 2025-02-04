$(document).ready(function () {
    let audioPlayer = $("#audio-player")[0];
    let playPauseBtn = $("#playPauseBtn");
    let currentSongText = $("#current-song");
    let songQueue = [];
    let currentIndex = 0;

    function playSong(songUrl, songTitle) {
        $("#music-player").show();
        audioPlayer.src = songUrl;
        audioPlayer.play();
        currentSongText.text(songTitle);
        playPauseBtn.text("⏸️");
    }

    playPauseBtn.click(function () {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.text("⏸️");
        } else {
            audioPlayer.pause();
            playPauseBtn.text("▶️");
        }
    });

    $("#nextBtn").click(function () {
        nextSong();
    });

    $("#prevBtn").click(function () {
        if (currentIndex > 0) {
            currentIndex--;
            playSong(songQueue[currentIndex].url, songQueue[currentIndex].title);
        }
    });

    function nextSong() {
        if (currentIndex < songQueue.length - 1) {
            currentIndex++;
            playSong(songQueue[currentIndex].url, songQueue[currentIndex].title);
        }
    }

    $(".play-song").click(function (e) {
        e.preventDefault();
        let songUrl = $(this).data("song-url");
        let songTitle = $(this).data("song-title");

        // Add song to queue
        songQueue.push({ url: songUrl, title: songTitle });

        // Play song if it's the first in queue
        if (songQueue.length === 1) {
            currentIndex = 0;
            playSong(songUrl, songTitle);
        }
    });

    // Play next song automatically when the current song ends
    audioPlayer.addEventListener("ended", function () {
        nextSong();
    });
});
