class queue{
    constructor(name){
        this.name = name
        this.list = []
        this.songNodesList = []
/*         this.songList = []
        this.playlistList = [] */
    }
    

    addSong(song, nodes){
        let songCopy = JSON.parse(JSON.stringify(song))
        songCopy.playbackId = this.list.length
        let song_node = new songNode(songCopy, nodes)

        song_node.node.querySelector('.queue_song_hover').addEventListener('click', () =>{
            this.loadSong(songCopy, nodes)
        })

        this.songNodesList.push(song_node)
        this.list.push(songCopy)
    }

    
    loadSong(song, nodes)
    {
        nodes.player.pause()

        nodes.player.currentSong = song.playbackId
        nodes.player.src = song.audio_link
        nodes.cover.src = song.cover_link
        nodes.songName.textContent = song.name
        nodes.songArtist.textContent = song.artist
        
        nodes.player.addEventListener('loadedmetadata', () =>{
            let totalTimeInSeconds = nodes.player.duration
            let minutes = Math.trunc(totalTimeInSeconds / 60) 
            let seconds = Math.trunc(totalTimeInSeconds - minutes*60) 
            if (seconds < 10) {
                seconds = `0${seconds}`
            } 
            nodes.totalTime.textContent = `${minutes}:${seconds}`


            
        })
        /*Color*/
        document.documentElement.style.setProperty('--bg_color', song.bg_color)

        nodes.player.play()        
    }


    start(nodes)
    {
        this.loadSong(this.list[0], nodes)
    } 
    
    play_pause({player})
    {
        switch (player.paused) {
            case true:
                player.play()
                break;
        
            case false:
                player.pause()
                break;
            default:
                console.log('No sé si está pausado 👀')
                break;
        }
    }
    
    next(nodes)
    {
        if(nodes.player.random)
        {
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
              }

              this.loadSong(this.list[getRandomInt(0, this.list.length)], nodes)

        }else{
            let currentSongIndex = nodes.player.currentSong
            if (currentSongIndex == this.list.length - 1) {
                this.loadSong(this.list[0], nodes)
                currentSongIndex = 0
            }else{
                currentSongIndex = currentSongIndex + 1
                this.loadSong(this.list[currentSongIndex], nodes)
            }
            nodes.player.currentSong = currentSongIndex
        }
    }

    previous(nodes)
    {
        let currentSongIndex = nodes.player.currentSong

        if (currentSongIndex == 0)
        {
            this.loadSong(this.list[this.list.length - 1], nodes)
        } else {
            this.loadSong(this.list[currentSongIndex - 1], nodes)
        }
    }

    removeSong(songIndex){
        this.list.splice(songIndex,1)
        /**Eliminar nodo de canción */
    }
    
}

class songNode{
    constructor(song, nodes)
    {
        this.song = song
    
        /**Renderizado */

        const mainContainer = document.createElement('div')
        mainContainer.classList.add('list_grid')
        mainContainer.classList.add('queue_list_song')
        mainContainer.id = `queueSong_${this.song.playbackId}`
            const songNumber = document.createElement('p')
            songNumber.textContent = `${this.song.playbackId + 1}`
            songNumber.classList.add('list_song_number')

            const detailsContainer = document.createElement('div')
            detailsContainer.classList.add('list_song_main')

            
                const img = document.createElement('img')
                img.classList.add('queue_song_cover')
                img.src = this.song.cover_link

                const hoverContainer = document.createElement('div')
                hoverContainer.classList.add('queue_song_hover')
                hoverContainer.id = this.song.playbackId

                    const hoverImg = document.createElement('img')
                    hoverImg.src = './media/icons/play-icon.svg'

                hoverContainer.append(hoverImg)

                const title = document.createElement('h4')
                title.classList.add('song_main_title')
                title.textContent = this.song.name

                const artist = document.createElement('p')
                artist.classList.add('song_main_artist')
                artist.textContent = this.song.artist

                /**Insertamos img, title y artist al details container */

                detailsContainer.append(img, hoverContainer, title, artist)

            const album = document.createElement('p')
            album.classList.add('list_song_album')
            album.textContent = this.song.album

            const duration = document.createElement('p')
            duration.classList.add('list_song_duration')
            duration.textContent = this.song.duration 
        
        /**Insertamos songNumber, detailsContainer, album, duration a mainContainer */
        mainContainer.append(songNumber, detailsContainer, album, duration)
        nodes.queue_list.append(mainContainer)
        this.node = mainContainer
    }

}

class playList{
    constructor(name){
        this.name = name
        this.list = []
        console.log(`El playlist '${this.name}' ha sido creado correctamente`)
    }


    addSong(name, artist, audioLink, coverLink, bg_color, album, duration){
        let newSong = new song(name, artist, audioLink, coverLink, bg_color, album, duration)
        this.list.push(newSong)
        console.log(`La canción ${name} - ${artist} ha sido agregada a la playlist '${this.name}'`)
    }

    deleteSong(songIndex)
    {
        this.list.splice(songIndex, 1)
    }

    addToQueue(queue, nodes)
    {
        this.list.forEach( song => {
            queue.addSong(song, nodes)
        })
    }
}

class song{
    constructor(name, artist, audio_link, cover_link, bg_color, album, duration)
    {
        this.name = name
        this.artist = artist
        this.audio_link = audio_link
        this.cover_link = cover_link
        this.bg_color = bg_color
        this.album = album
        this.duration = duration
    }
    
}



const startUpPlayer = (nodes, cola) => {
    
    const currentTimeModifier = (currentTime) => {
        let currentTimeInSeconds = currentTime
        
        if(currentTimeInSeconds > 1)
        {
            nodes.progress_bar.value = currentTimeInSeconds / nodes.player.duration * 100
        }else{
            nodes.progress_bar.value = 0
        }
        
        let minutes = Math.trunc(currentTimeInSeconds / 60) 
        let seconds = Math.trunc(currentTimeInSeconds - minutes*60) 
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        nodes.currentTime.textContent = `${minutes}:${seconds}`
    }
    
    const barByMouse = mouse => {
        let progress_bar = nodes.progress_bar 
        let xmouse = mouse.offsetX
        let barPercent = xmouse / progress_bar.offsetWidth
        progress_bar.value = barPercent * 100
        let currentTime = nodes.player.duration * barPercent
        currentTimeModifier(currentTime)
    }
    
    const timeUpdater = () => {
        currentTimeModifier(nodes.player.currentTime)
    }
    
    const mouseDownHandler = () => {
        nodes.player.removeEventListener('timeupdate', timeUpdater)
        nodes.progress_bar.addEventListener('mousemove', barByMouse)
    }
    
    const mouseUpHandler = mouse => {
        let progress_bar = nodes.progress_bar 
        
        progress_bar.removeEventListener('mousemove', barByMouse)
        nodes.player.addEventListener('timeupdate', timeUpdater)
        
        let xmouse = mouse.offsetX
        let barPercent = xmouse / progress_bar.offsetWidth
        nodes.player.currentTime = barPercent * nodes.player.duration
        console.log()
    }
    
    nodes.play_pauseButton.addEventListener('click', () => {
        cola.play_pause(nodes);
    })
    
    nodes.player.addEventListener('pause', () => {
        nodes.play_icon.classList.remove('hidden')
        nodes.pause_icon.classList.add('hidden')
    })
    
    nodes.player.addEventListener('play', () => {
        nodes.pause_icon.classList.remove('hidden')
        nodes.play_icon.classList.add('hidden')
    })
    
    nodes.player.random = false
    nodes.player.addEventListener('timeupdate', timeUpdater)
    nodes.progress_bar.addEventListener('mousedown', mouseDownHandler)
    nodes.progress_bar.addEventListener('mouseup', mouseUpHandler)

    


    nodes.nextButton.addEventListener('click', () => {
        cola.next(nodes)
    })
    
    nodes.player.addEventListener('ended', () => {
        cola.next(nodes);
    })

    nodes.previousButton.addEventListener('click', () => {
        cola.previous(nodes)
    })


    nodes.randomButton.addEventListener('click', () => {
        switch (nodes.player.random)
        {
            case true:
                nodes.player.random = false
                nodes.randomButton.classList.remove('pressed')
                break;
            
            case false:
                nodes.player.random = true
                nodes.randomButton.classList.add('pressed')
                break;                
            default:
                console.log('Ha ocurrido un error con random 😳')
                break;
        }
    })

    nodes.loopButton.addEventListener('click', () => {
        switch(nodes.player.loop)
        {
            case true:
                nodes.loopButton.classList.remove('pressed')
                nodes.player.loop = false
                break;

            case false:
                nodes.loopButton.classList.add('pressed')
                nodes.player.loop = true
                break;
        
            default:
                break;
        }
    })

    nodes.queue_button.addEventListener('click', () => {
        nodes.queue.classList.toggle('hidden')
    })

    nodes.queue_backButton.addEventListener('click', () => {
        nodes.queue.classList.toggle('hidden')
        
    })

}



document.addEventListener('DOMContentLoaded', () => {
    const nodes = {
        cover: document.querySelector('.covers_current img'),
        songName: document.querySelector('.details_name'),
        songArtist: document.querySelector('.details_artist'),
        currentTime: document.querySelector('.details_progress_time-current'),
        progress_bar: document.querySelector('.details_progress_bar'),
        totalTime: document.querySelector('.details_progress_time-total'),
        player: document.querySelector('.player'),
        randomButton: document.querySelector('#random'),
        previousButton: document.querySelector('#previous'),
        play_pauseButton: document.querySelector('#play'),
        play_icon: document.querySelector('#play-icon'),
        pause_icon: document.querySelector('#pause-icon'),
        nextButton: document.querySelector('#next'),
        loopButton: document.querySelector('#loop'),
        queue: document.querySelector('.queue'),
        queue_button: document.querySelector('#queue_button'),
        queue_backButton: document.querySelector('.queue_backButton'),
        queue_list: document.querySelector('.queue_list')
    }

    let cola = new queue('cola')
    
    startUpPlayer(nodes, cola);
    
    let your_heart = new playList('your broken heart')
    your_heart.addSong('Crush', 'Glades', './media/audio/crush.mp3', './media/album-covers/cover.jpg', '#BBE8F2', 'Planetarium', '3:13')/**#BBE8F2 */
    your_heart.addSong('Padre Nuestro', 'Un Corazón', './media/audio/padrenuestro.mp3', './media/album-covers/cieloenlatierra.jpg', '#eae4d6', 'Cielo en la tierra', '3:17')/**eae4d6 */
    your_heart.addSong('Dr Jones and The Kings of Rhythm', 'Guardian', './media/audio/Dr Jones.mp3', './media/album-covers/miracle-mile.jpg', '#e9c465', 'Miracle Mile', '5:20') /** e9c465*/
    your_heart.addSong('Need Your Love', 'Hillsong Y&F', './media/audio/need your love.mp3', './media/album-covers/allofmybestfriends.jpg', '#78b2b5', 'All of my best friends', '3:40')/*#78b2b5 */
    your_heart.addSong('Armonia', 'Un Corazón ft Lead', './media/audio/armonia.mp3', './media/album-covers/sinergia.jpg', '#eea1c5', 'Sinergia', '2:57')/**#eea1c5 */
    your_heart.addToQueue(cola, nodes)
    cola.start(nodes)
    nodes.player.pause()
})










//testing
{
}

