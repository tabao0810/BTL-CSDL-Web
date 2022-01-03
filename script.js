const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cbthumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')

const PLAYER_STORAGE_KEY = 'BAO'

const progess = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const blockOption = $('.blockOption')
const boxOption = $('.boxOption')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))  || {},
    
    songs: [
        {
            name: 'Thay lòng',
            singer: '',
            path: './Song/song1.mp3',
            image: './Img/song1.jpg'
        },
        {
            name: 'Cô đơn dành cho ai',
            singer: '',
            path: './Song/song2.mp3',
            image: './Img/song2.jpg'
        },
        {
            name: 'Em là con thuyền cô đơn',
            singer: '',
            path: './Song/song3.mp3',
            image: './Img/song3.jpg'
        },
        {
            name: 'Arcena',
            singer: '',
            path: './Song/song4.mp3',
            image: './Img/song4.jpg'
        },
        {
            name: 'Rise',
            singer: '',
            path: './Song/song5.mp3',
            image: './Img/song5.jpg'
        },
        {
            name: 'K/DA',
            singer: '',
            path: './Song/song6.mp3',
            image: './Img/song6.jpg'
        }
    ],

    setConfig: function(key,value) {
        this.config[key] =value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `
            <div data-index ="${index}" class="song ${index === this.currentIndex ? 'active' : ''}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {    
        const _this = this   
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
         
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //CD quay/dung
        const cdthumbanimate = cbthumb.animate([
            {transform: 'rotate(360deg)'}],
            {duration:10000,
        iterations: Infinity})

        playBtn.onclick = function(){
            if(_this.isPlaying){               
                audio.pause();                
            }else{               
                audio.play();                
            }           
        }
        cdthumbanimate.pause()

        //khi nhac duoc play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdthumbanimate.play();
        }
        //khi nhac bi pause
        audio.onpause = function(){
            _this.isPlaying  = false;
            player.classList.remove('playing');
            cdthumbanimate.pause();
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progesPercent = Math.floor(audio.currentTime/audio.duration * 100)
                progess.value = progesPercent
            }
        }

        progess.onchange = function(e){
           const seekTime = audio.duration/100 * e.target.value;
           audio.currentTime = seekTime;
        }

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
          _this.nextSong()}
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }
        preBtn.onclick = function() {
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
      
        }

        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
      
        }

        audio.onended = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else
             if(_this.isRepeat){
                audio.play()
             }else{
          _this.nextSong()
        }
          audio.play()
        }
       
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')

            if( songNode || songOption ){
                    if(songNode){
                        _this.currentIndex = parseInt(songNode.dataset.index)
                        _this.loadCurentSong()
                        audio.play()
                        _this.render()
                    }else if(songOption){                
                     blockOption.classList.add('action')
                     boxOption.classList.add('action')                    
                    }
            }
            

        }
        boxOption.onclick = function(){
            boxOption.classList.remove('action')
            blockOption.classList.remove('action')
        }
       
    },    

    scrollToActiveSong : function() {
        setTimeout($('.song.active').scrollIntoView({
            behavior: 'smooth',
            block : 'nearest'
        }),500)
    },
    loadCurentSong: function () {
        heading.textContent = this.currentSong.name;
        cbthumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat 
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    },
    
    nextSong: function(){
            this.currentIndex++
            if(this.currentIndex >= this.songs.length ){
                this.currentIndex=0
            }
            this.loadCurentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurentSong()
},
playRandomSong: function(){
    let newIndex
    do{
        newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex )

    this.currentIndex = newIndex
    this.loadCurentSong()
},

    start: function () {
        this.defineProperties()

        this.loadConfig()

        this.handleEvents()//xử lý sự kiện DOM

        this.loadCurentSong();//load thong tin baif hat

        this.render()//Render danh sách bài hát
    }

}
app.start();