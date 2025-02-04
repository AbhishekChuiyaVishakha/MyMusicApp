$(document).ready(function () {
    let audioPlayer = $("#audio-player")[0];
    let playPauseBtn = $("#playPauseBtn");
    let currentSongText = $("#current-song");
    let seekbar = $("#seekbar");
    let currentTimeDisplay = $("#current-time");
    let durationDisplay = $("#total-duration");
    let songQueue = [];
    let currentIndex = 0;
    let isSeeking = false;

    function playSong(songUrl, songTitle) {
        console.log("Playing song:", songTitle, songUrl);
        $("#music-player").show();
        audioPlayer.src = songUrl;
        audioPlayer.play();
        currentSongText.text(songTitle);
        playPauseBtn.text("⏸️");

        // Reset seekbar & time
        seekbar.val(0);
        currentTimeDisplay.text("0:00");
        durationDisplay.text("0:00");

        // Wait for metadata to load before setting duration
        audioPlayer.onloadedmetadata = function () {
            console.log("Metadata loaded. Duration:", audioPlayer.duration);
            seekbar.attr("max", audioPlayer.duration);
            durationDisplay.text(formatTime(audioPlayer.duration));
        };

        audioPlayer.ontimeupdate = function () {
            console.log("Updating time:", audioPlayer.currentTime);
            if (!isSeeking) {
                seekbar.val(audioPlayer.currentTime);
                currentTimeDisplay.text(formatTime(audioPlayer.currentTime));
            }
        };
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

    audioPlayer.addEventListener("ended", function () {
        nextSong();
    });

    // ✅ Fix Seekbar: Allow dragging and updating time
    seekbar.on("input", function () {
        console.log("Seekbar dragged to:", seekbar.val());
        isSeeking = true;
        currentTimeDisplay.text(formatTime(seekbar.val()));
    });

    seekbar.on("change", function () {
        console.log("Seekbar changed to:", seekbar.val());
        isSeeking = false;
        audioPlayer.currentTime = seekbar.val();
    });

    // ✅ Format time function (MM:SS)
    function formatTime(seconds) {
        let mins = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" + secs : secs}`;
    }
});
