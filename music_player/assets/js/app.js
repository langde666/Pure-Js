const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'LANG_DE_PLAYER';

const cd = $('.dashboard__cd');
const heading = $('.dashboard__header h2');
const subheading = $('.dashboard__header p');
const cdThumb = $('.dashboard__cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    songs: [{
        name: 'Dona Dona',
        singer: 'Joan Baez',
        path: './assets/music/Dona Dona - Joan Baez.mp3',
        img: './assets/img/dona-dona-joan-baez.jpg'
    },{
        name: 'The Sound of Silence',
        singer: 'Simon & Garfunkel',
        path: './assets/music/The sound of silence - Paul Simon, Garfunkel.mp3',
        img: './assets/img/the-sound-of-silence-simon-&-garfunkel.jpg'
    },{
        name: 'Take Me Home, Country Roads',
        singer: 'John Denver',
        path: './assets/music/Take Me Home Country Road - John Denver.mp3',
        img: './assets/img/take-me-home-country-road-john-denver.jpg'
    },{
        name: '500 Miles',
        singer: 'Justin Timberlake, Carey Mulligan, Stark Sands',
        path: './assets/music/500 Miles - Justin Timberlake, Carey Mulligan, Stark Sands.mp3',
        img: './assets/img/500-Miles-Justin-Timberlake-Carey-Mulligan-Stark-Sands.jpg'
    },{
        name: 'Bridge Over Troubled Water',
        singer: 'Simon & Garfunkel',
        path: './assets/music/Bridge Over Troubled Water - Simon, Garfunkel.mp3',
        img: './assets/img/Simon_and_Garfunkel,_Bridge_over_Troubled_Water_(1970).jpg'
    },{
        name: 'Don\'T Stop Me Now',
        singer: 'Queen',
        path: './assets/music/Don\'T Stop Me Now - Queen.mp3',
        img: './assets/img/DonTStopMeNow.jpg'
    },{
        name: 'Hey Jude',
        singer: 'The Beatles',
        path: './assets/music/Hey Jude - The Beatles.mp3',
        img: './assets/img/HeyJudeTheBeatles.jpg'
    },{
        name: 'Hotel Califonia',
        singer: 'Eagles',
        path: './assets/music/Hotel Califonia - Eagles.mp3',
        img: './assets/img/HotelCalifonia-Eagles.jpg'
    },{
        name: 'How Deep Is Your Love',
        singer: 'Bee Gees',
        path: './assets/music/How Deep Is Your Love - Bee Gees.mp3',
        img: './assets/img/How_Deep_Is_Your_Love.jpg'
    },{
        name: 'I Love You Baby',
        singer: 'Frank Sinatra',
        path: './assets/music/I Love You Baby - Frank Sinatra.mp3',
        img: './assets/img/ILoveUBaBy-FrankSinatra.jpg'
    }],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    playedList: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <!-- Song -->
                <div class="song ${ index === this.currentIndex ? 'active' : '' }" data-index="${index}">
                    <!-- Thumb -->
                    <div class="song__thumb" style="background-image: url('${song.img}')">

                    </div>

                    <!-- Body -->
                    <div class="song__body">
                        <h3 class="song__body-title">${song.name}</h3>
                        <p class="song__body-author">${song.singer}</p>
                    </div>

                    <!-- Option -->
                    <div class="song__opdtion">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });

        $('.playlist').innerHTML = htmls.join('');

    },
    handleEvents: function() {
        const _this = this;

        //scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = (newWidth > 0) ? (newWidth + 'px') : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        //toggle play button
        playBtn.onclick =  function() {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        //audio play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        }

        //audio pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        }

        //audio playing
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                _this.setConfig('seekTime', audio.currentTime);
            }
        }

        //audio end
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        //cd animation
        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ],{
            duration: 10000,
            iterations: Infinity
        });

        cdThumbAnimation.pause();

        //progresss forward, backword
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration / 100);
            audio.currentTime = seekTime;
            _this.setConfig('seekTime', audio.currentTime);
        }

        //next. prev button
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.loadRandomSong();
            }
            else {
                _this.loadNextSong();
            }
            audio.play();
        }

        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.loadRandomSong();
            }
            else {
                _this.loadPrevSong();
            }
            audio.play();
        }

        //random button
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('btn--active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
            
            if(_this.isRandom) {
                _this.playedList = [];
                _this.playedList.push(_this.currentIndex);
            }

            if(_this.isRepeat) {
                _this.isRepeat = false;
                repeatBtn.classList.remove('btn--active');
                _this.setConfig('isRepeat', _this.isRepeat);
            }  
        }

        //repeat button
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('btn--active', _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);

            if(_this.isRandom) {
                _this.isRandom = false;
                randomBtn.classList.remove('btn--active');
                _this.setConfig('isRandom', _this.isRandom);
            }   
        }

        //playlist
        playlist.onclick = function(e) {
            const newSong = e.target.closest('.song:not(.active)');
            const option = e.target.closest('.song__opdtion');

            if (newSong || option) {
                if (newSong) {
                    _this.currentIndex = Number(newSong.attributes[1].value);
                    _this.loadCurrentSong();
                    audio.play();
                }

                if (option) {
                    
                }
            }
        }
    },
    saveCurrentIndex: function() {
        this.setConfig('currentIndex', this.currentIndex);
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = Number(this.config.currentIndex) || 0;
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        subheading.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;

        const oldSong = $('.song.active');
        if (oldSong) {
            oldSong.classList.remove('active');
        }
        
        const newSong = $(`.song[data-index="${this.currentIndex}"]`);
        if (newSong) {
            newSong.classList.add('active');
        }

        this.saveCurrentIndex();
        this.scrollToActiveSong();
    },
    loadNextSong: function() {
        if (this.currentIndex === this.songs.length - 1) {
            this.currentIndex = 0;
        }
        else {
            this.currentIndex++;
        }

        this.loadCurrentSong()
    },
    loadPrevSong: function() {
        if (this.currentIndex === 0) {
            this.currentIndex = this.songs.length - 1;
        }
        else {
            this.currentIndex--;
        }

        this.loadCurrentSong();
    },
    loadRandomSong: function() {
        if (this.playedList.length === this.songs.length) {
            this.playedList = [];
            this.playedList.push(this.currentIndex);
        }

        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (this.playedList.includes(newIndex));

        this.currentIndex = newIndex;
        this.playedList.push(newIndex);

        this.loadCurrentSong();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            const curSong = $('.song.active');
            if (curSong) {
                curSong.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
        }, 300)
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();

        randomBtn.classList.toggle('btn--active', this.isRandom);
        repeatBtn.classList.toggle('btn--active', this.isRepeat);
        audio.currentTime = this.config.seekTime;
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent;
    }
}

app.start()