const getSongs = () => {
    const transcript = document.getElementsByClassName("ytd-transcript-renderer")
    const captions = transcript.content.getElementsByTagName("ytd-transcript-segment-renderer")
    const reg = /^\[♪ "(.+)" by (.+) ♪\]$/
    
    const songs = {}
    for (let sub of captions) {
        const tmp = sub.innerText.split('\n')
        const time = tmp[0]
        const text = tmp[1]
    
        const groups = text.match(reg)
        if (groups == null) {
            continue
        }
    
        const t = time.split(':')
        const min = parseInt(t[0])
        const sec = parseInt(t[1])
        const timestamp = min * 60 + sec
    
        songs[timestamp] = {
            "artist": groups[1],
            "title": groups[2]
        }
    }
    return songs
}

const spotifyLink = (song) => {
    const search = `${song.artist} ${song.title}`
    return `https://open.spotify.com/search/${search}`
}

const getPlayer = () => {
    const p1 = document.querySelector("#player")
    const p2 = document.querySelector("#player-theater-container")
    return p1.offsetWidth == 0 ? p2 : p1
}

const showToast = (link, artist, title) => {
    const p = getPlayer()
    Toastify({
        text: `${artist} - ${title}`,
        duration: 8000,
        newWindow: true,
        destination: link,
        avatar: 'https://cdn-icons-png.flaticon.com/512/174/174872.png',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        offset: {
            x: window.innerWidth - p.offsetLeft - p.offsetWidth,
            y: p.offsetTop
        },
        className: 'toast'
    }).showToast()
}

const setHooks = () => {
    // load songs from API, temporary solution is to get from transcripts
    const songs = getSongs()

    // hookup on video
    let lastTime = 0
    const video = document.querySelector('video')
    video.ontimeupdate = (_) => {
        const time = Math.floor(video.currentTime)
        if (time == lastTime) {
            return;
        }
        lastTime = time

        const song = songs[time]
        if (song != null) {
            showToast(spotifyLink(song), song.artist, song.title)
        }
    }
}

window.onload = () => {
    setTimeout(setHooks, 7000)
}
