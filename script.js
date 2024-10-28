document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const seekSlider = document.getElementById('seek-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const shuffleBtn = document.getElementById('shuffle');
    const loopBtn = document.getElementById('loop');
    const songDetails = document.getElementById('song-details');
    const playlist = document.getElementById('playlist');

    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffling = false;
    let songs = [];

    const loadSongs = () => {
        songs = [
            { path: 'music/webmaniatheme1.mp3', title: 'ウェブマニアのテーマ1', artist: 'sunoAI, ウェブマニアbot, 8313p' },
            { path: 'music/webmaniatheme2.mp3', title: 'ウェブマニアのテーマ2', artist: 'sunoAI, ウェブマニアbot, 8313p' },
            // 他の曲を追加
        ];
        
        renderPlaylist();
    };

    const renderPlaylist = () => {
        playlist.innerHTML = '';
        songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
            item.textContent = `${song.title} - ${song.artist}`;
            item.addEventListener('click', () => playSong(index));
            playlist.appendChild(item);
        });
    };

    const updateSongInfo = () => {
        const song = songs[currentSongIndex];
        songDetails.textContent = `${song.title} - ${song.artist}`;
    };

    const playSong = (index) => {
        currentSongIndex = index;
        audio.src = songs[index].path;
        audio.play();
        isPlaying = true;
        updatePlayButton();
        updateSongInfo();
        renderPlaylist();
    };

    const updatePlayButton = () => {
        playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    });

    nextBtn.addEventListener('click', () => {
        if (isShuffling) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        playSong(currentSongIndex);
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.classList.toggle('active');
    });

    loopBtn.addEventListener('click', () => {
        audio.loop = !audio.loop;
        loopBtn.classList.toggle('active');
    });

    seekSlider.addEventListener('input', () => {
        const time = (seekSlider.value * audio.duration) / 100;
        audio.currentTime = time;
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });

    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        seekSlider.value = percent;
        seekSlider.style.backgroundSize = `${percent}% 100%`;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('error', () => {
        alert("オーディオファイルを読み込めませんでした。ファイルパスを確認してください。");
    });

    audio.addEventListener('ended', () => {
        if (isShuffling) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        playSong(currentSongIndex);
    });

    loadSongs();
});
