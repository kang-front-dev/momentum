
//----------------------------TIME-SCRIPT-----------------------------



if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'en')
}

let langChoice = localStorage.getItem('lang')


let timeBlock = document.querySelector('.time'),
    dateBlock = document.querySelector('.date'),
    greetingBlock = document.querySelector('.greeting'),
    dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }
function timeStart() {
    let date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        monthNum = date.getMonth(),
        dayNum = date.getDay(),
        dayDate = date.getDate()

    let weekDay = checkWeek(dayNum)
    let month = checkMonth(monthNum)
    seconds = seconds < 10 ? '0' + seconds : seconds
    minutes = minutes < 10 ? '0' + minutes : minutes
    dateBlock.textContent = date.toLocaleString(`${langChoice}`, dateOptions)
    timeBlock.textContent = `${hours}:${minutes}:${seconds}`
    greetingBlock.textContent = greetingGenerate()

    setTimeout(() => {
        timeStart()
    }, 1000);
}



let dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
function checkWeek(day) {
    return dayArr[day]
}
let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function checkMonth(month) {
    return monthArr[month]
}
timeStart()

function greetingGenerate() {
    let date = new Date(),
        hours = date.getHours()

    if (hours >= 6 && hours < 12) {
        return langData.greetings.morning[langChoice]
    } else if (hours >= 12 && hours < 18) {
        return langData.greetings.day[langChoice]
    } else if (hours >= 18 && hours < 24) {
        return langData.greetings.evening[langChoice]
    } else if (hours >= 0 && hours < 6) {
        return langData.greetings.night[langChoice]
    }
}

let greetingInput = document.querySelector('.name')

greetingInput.setAttribute('placeholder', langData.greetingInput[langChoice])
greetingInput.value = localStorage.getItem('name')
greetingInput.addEventListener('input', () => {
    localStorage.setItem('name', greetingInput.value)
})

//----------------------------QUOTES-SCRIPT-----------------------------

//langData is in data.js file

let quoteBlock = document.querySelector('.quote')
let authorBlock = document.querySelector('.author')
let quoteLine = document.querySelector('.quote-line')


let quoteReady = false
function randomQuote() {
    let randomNum = Math.floor(Math.random() * (Object.keys(langData.quotes).length - 1))
    let finalQuote = langData.quotes[randomNum][langChoice]
    setQuote(finalQuote[0], finalQuote[1])
}
randomQuote()
function setQuote(str, name) {
    let arr = str.split(""),
        count = 0,
        finalArr = []

    function typeText(array) {
        if (count < array.length) {
            finalArr.push(array[count])
            count++
            setTimeout(() => {
                typeText(array)
                quoteBlock.textContent = finalArr.join("")
            }, 40);
        } else {
            authorAppear(name)
            quoteReady = true
            console.log('quote is ready');
            return
        }
    }

    typeText(arr)

    quoteBlock.textContent = finalArr.join()
}

setInterval(() => {
    quoteLine.classList.toggle('quote-line-active')
}, 500);


function authorAppear(name) {
    authorBlock.classList.add('author-active')
    authorBlock.textContent = name
}

function authorDisappear() {
    if (authorBlock.classList.contains('author-active')) {
        authorBlock.classList.remove('author-active')
    }
}

let changeQuoteBtn = document.querySelector('.change-quote')
changeQuoteBtn.addEventListener('click', () => {

    if (quoteReady) {
        quoteReady = false
        changeQuoteBtn.classList.add('change-quote-active')
        setTimeout(() => {
            changeQuoteBtn.classList.remove('change-quote-active')
        }, 500);
        authorDisappear()
        quoteBlock.classList.add('quote-active')
        setTimeout(() => {
            randomQuote()
            quoteBlock.classList.remove('quote-active')

        }, 1000);
    }

})



// --------------------------WALLPAPER-SCRIPT--------------------------



let background = document.querySelector('.parallax-img'),
    btnPrev = document.querySelector('.slide-prev'),
    btnNext = document.querySelector('.slide-next'),
    backgroundCount = 1

btnPrev.addEventListener('click', () => {
    if (backgroundCount > minNum && backgroundCount <= maxNum) {
        backgroundCount--
    } else {
        backgroundCount = maxNum
    }
    console.log(backgroundCount);
    backgroundChange(backgroundCount)
})
btnNext.addEventListener('click', () => {
    if (backgroundCount >= minNum && backgroundCount < maxNum) {
        backgroundCount++
    } else {
        backgroundCount = minNum
    }

    console.log(backgroundCount);
    backgroundChange(backgroundCount)
})
let maxNum, minNum, dayState;
backgroundChange()
function backgroundChange(num) {
    if (!num) {
        if (greetingGenerate() == langData.greetings.morning[langChoice]) {
            minNum = 1
            maxNum = 5
            dayState = 'morning'
        } else if (greetingGenerate() == langData.greetings.day[langChoice]) {
            minNum = 6
            maxNum = 10
            dayState = 'day'
        } else if (greetingGenerate() == langData.greetings.evening[langChoice]) {
            minNum = 11
            maxNum = 15
            dayState = 'evening'
        } else if (greetingGenerate() == langData.greetings.night[langChoice]) {
            minNum = 16
            maxNum = 20
            dayState = 'night'
        }
        let randomNum = generateRandomNum(minNum, maxNum)
        background.style.backgroundImage = `url('assets/img/${dayState}/${randomNum}.jpg')`
        backgroundCount = randomNum
    } else {
        background.style.backgroundImage = `url('assets/img/${dayState}/${num}.jpg')`
    }


}

function generateRandomNum(min, max) {
    return Math.ceil(Math.random() * (max - min) + min)
}


// PARALLAX

let mouseEvent;

document.addEventListener('mousemove', (e) => {
    mouseEvent = e
    window.requestAnimationFrame(parallax)
})

function parallax() {
    let width = document.documentElement.clientWidth / 2
    let height = document.documentElement.clientHeight / 2
    let x = (width - mouseEvent.clientX) / 10
    let y = (height - mouseEvent.clientY) / 10

    background.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`
}


// ------------------------AUDIO-SCRIPT------------------------



let playBtn = document.querySelector('.play'),
    playNextBtn = document.querySelector('.play-next'),
    playPrevBtn = document.querySelector('.play-prev'),
    playList = document.querySelector('.play-list'),
    playListLi = playList.querySelectorAll('li'),
    audioCount = 0

let breatheEl = document.getElementById('breathe-btn'),
    memoriesEl = document.getElementById('memories-btn'),
    solaceEl = document.getElementById('solace-btn'),
    solitudeEl = document.getElementById('solitude-btn')

const breatheAudio = new Audio('assets/sounds/Breathe.mp3'),
    memoriesAudio = new Audio('assets/sounds/Childhood Memories.mp3'),
    solaceAudio = new Audio('assets/sounds/Solace.mp3'),
    solitudeAudio = new Audio('assets/sounds/Solitude.mp3')

const audioData = {
    0: {
        title: 'Breathe',
        artist: 'mell-ø',
        duration: '2:07'
    },
    1: {
        title: 'Childhood',
        artist: 'mell-ø',
        duration: '1:40'
    },
    2: {
        title: 'Solace',
        artist: 'mell-ø',
        duration: '1:45'
    },
    3: {
        title: 'Solitude',
        artist: 'mell-ø',
        duration: '1:28'
    },
}

const audioArr = [breatheAudio, memoriesAudio, solaceAudio, solitudeAudio]

let audioElArr = [breatheEl, memoriesEl, solaceEl, solitudeEl]
playList.addEventListener('click', (e) => {
    if (e.target.id === 'breathe' || e.target.id === 'breathe-btn') {
        playAudio(0)
        audioCount = 0
    } else if (e.target.id === 'memories' || e.target.id === 'memories-btn') {
        playAudio(1)
        audioCount = 1
    } else if (e.target.id === 'solace' || e.target.id === 'solace-btn') {
        playAudio(2)
        audioCount = 2
    } else if (e.target.id === 'solitude' || e.target.id === 'solitude-btn') {
        playAudio(3)
        audioCount = 3
    }
})

audioArr.forEach((item) => {
    item.volume = 0.5
})

function playAudio(num) {
    stopAudio()
    playBtn.classList.add('pause')
    audioCount = num
    audioArr[num].play()
    audioArr[num].currentTime = 0

    audioElArr[num].classList.add('pause-btn')
    if (extendedPlayIcon) {
        extendedPlayIcon.classList.add('extended-pause-icon')
    }
    let audioLink = audioElArr[num].nextElementSibling
    audioLink.classList.add('play-item-active')

    if (extCardArr && !extCardArr[num].classList.contains('extended-card-active')) {
        extCardClearActives()
        extCardArr[num].classList.add('extended-card-active')
    }
    changePreview(num)
    changeTime(num)
    visualizerStart(audioLink)
    extendedVisualizerStart()
    writeTrackInfo(audioArr[num], num)
    previewRotate = true
    previewRotateStart()

}
function stopAudio() {

    audioArr.forEach((item) => {
        item.pause()
    })
    audioElArr.forEach((item) => {
        item.className = 'play-item-icon'
        item.nextElementSibling.className = 'play-item'
    })
    if (extendedPlayIcon.classList.contains('extended-pause-icon')) {
        extendedPlayIcon.classList.remove('extended-pause-icon')
    }
    visualizerStop()
    extendedVisualizerStop()
    previewRotateStop()
}
function volumeScale(item) {
    item.volume += item.volume
}
playBtn.addEventListener('click', (e) => {
    if (playBtn.classList.contains('pause')) {
        playBtn.classList.remove('pause')
        stopAudio()
    } else {
        playAudio(audioCount)
    }
})
playPrevBtn.addEventListener('click', () => {
    if (audioCount != 0) {
        audioCount--
    } else {
        audioCount = 3
    }
    playAudio(audioCount)
})
playNextBtn.addEventListener('click', () => {
    if (audioCount != 3) {
        audioCount++
    } else {
        audioCount = 0
    }
    playAudio(audioCount)
})

let lastVolumeValue = 0

function volumeMute() {
    console.log('muted');
    audioArr[audioCount].volume = 0
    extendedVolumeProgress.value = 0
    extendedVolumeProgress.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${extendedVolumeProgress.value - 1}%, #fff ${extendedVolumeProgress.value}%, white 100%)`
}
function volumeUnmute() {
    console.log('unmuted');
    audioArr[audioCount].volume = lastVolumeValue
    extendedVolumeProgress.value = lastVolumeValue * 100
    extendedVolumeProgress.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${extendedVolumeProgress.value - 1}%, #fff ${extendedVolumeProgress.value}%, white 100%)`
}


// ------------------------EXTENDED-AUDIO-PLAYER-SCRIPT----------------------------



let extendedWrapper = document.querySelector('.extended'),
    extendedPlayer = document.querySelector('.extended-player'),
    extendedTimeline = document.querySelector('.extended-player-input'),
    extendedVolumeProgress = document.querySelector('.extended-volume-input'),
    extendedPreview = document.querySelector('.extended-player-preview')


progressStart(extendedTimeline)
progressStart(extendedVolumeProgress)
function progressStart(el) {
    el.addEventListener('input', function (ev) {
        const value = ev.target.value

        if (ev.target.value > 70) {
            ev.target.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${value - 2}%, #fff ${value - 2}%, white 100%)`
        } else {
            ev.target.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${value}%, #fff ${value}%, white 100%)`
        }

        if (ev.target == extendedTimeline) {
            extendedSetTime(ev.target.value)
        }
        if (ev.target == extendedVolumeProgress) {
            extendedSetVolume(ev.target.value)
        }

    })
}


function changePreview(key) {
    let arr = [
        'extended-preview-breathe',
        'extended-preview-childhood',
        'extended-preview-solace',
        'extended-preview-solitude'
    ]
    extendedPreview.className = 'extended-player-preview'
    extendedPreview.classList.add(arr[key])
}


let extendedPlayBtn = document.querySelector('.extended-play-block'),
    extendedPrevBtn = document.querySelector('.extended-prev-block'),
    extendedNextBtn = document.querySelector('.extended-next-block'),
    extendedVolumeBtn = document.querySelector('.extended-volume-btn')


extendedPlayBtn.addEventListener('mousedown', () => {
    extendedPlayBtn.classList.add('extended-btn-active')
})
extendedPrevBtn.addEventListener('mousedown', () => {
    extendedPrevBtn.classList.add('extended-btn-active')
    if (audioCount != 0) {
        audioCount--
    } else {
        audioCount = 3
    }
    playAudio(audioCount)
})
extendedNextBtn.addEventListener('mousedown', () => {
    extendedNextBtn.classList.add('extended-btn-active')
    if (audioCount != 3) {
        audioCount++
    } else {
        audioCount = 0
    }
    playAudio(audioCount)

})
extendedVolumeBtn.addEventListener('mousedown', () => {
    extendedVolumeBtn.classList.toggle('extended-btn-active')
    extendedVolumeBtn.children[0].classList.toggle('extended-volume-mute-icon')

    if (extendedVolumeBtn.children[0].classList.contains('extended-volume-mute-icon')) {
        lastVolumeValue = audioArr[audioCount].volume
        console.log('volume:' + lastVolumeValue);
        volumeMute()
    } else {
        volumeUnmute()
    }
})

extendedPlayBtn.addEventListener('mouseup', () => {
    extendedPlayBtn.classList.remove('extended-btn-active')
})
extendedPrevBtn.addEventListener('mouseup', () => {
    extendedPrevBtn.classList.remove('extended-btn-active')
})
extendedNextBtn.addEventListener('mouseup', () => {
    extendedNextBtn.classList.remove('extended-btn-active')
})



let extendedMousePress = false


window.addEventListener('mousedown', () => {
    extendedMousePress = true
})
window.addEventListener('mouseup', () => {
    extendedMousePress = false
})



window.addEventListener('mousemove', () => {
    if (!extendedMousePress) {
        if (extendedPlayBtn.classList.contains('extended-btn-active')) {
            extendedPlayBtn.classList.remove('extended-btn-active')

        }
        if (extendedPrevBtn.classList.contains('extended-btn-active')) {
            extendedPrevBtn.classList.remove('extended-btn-active')

        }
        if (extendedNextBtn.classList.contains('extended-btn-active')) {
            extendedNextBtn.classList.remove('extended-btn-active')
        }

    }


})

let extendedPlayIcon = document.querySelector('.extended-play-icon')

extendedPlayBtn.addEventListener('click', () => {

    if (extendedPlayIcon.classList.contains('extended-pause-icon')) {
        extendedPlayIcon.classList.remove('extended-pause-icon')
        stopAudio()
    } else {
        extendedPlayIcon.classList.add('extended-pause-icon')
        if (audioArr[audioCount].currentTime > 0) {
            audioArr[audioCount].play()
            extendedVisualizerStart()
            previewRotateStart()
        } else {
            playAudio(audioCount)
        }

    }
})




let extendedTitle = document.querySelector('.extended-player-title'),
    extendedArtist = document.querySelector('.extended-player-artist'),
    extendedDuration = document.querySelectorAll('.extended-player-duration')

writeTrackInfo()




function writeTrackInfo(track, index) {
    if (!track && !index) {
        extendedDuration.forEach((item) => {
            item.textContent = audioData[0].duration
        })

        extendedTitle.textContent = audioData[0].title
        extendedArtist.textContent = audioData[0].artist
    } else {
        extendedDuration.forEach((item) => {
            item.textContent = audioData[index].duration
        })

        extendedTitle.textContent = audioData[index].title
        extendedArtist.textContent = audioData[index].artist
    }

}
extendedTimeline.addEventListener('input', () => {
    console.log(audioArr[audioCount].currentTime);
})

function changeTime(val) {
    console.log('change time started');
    console.log('value:' + val);
    console.log('audioCount:' + audioCount);
    if (val) {
        audioArr[val].addEventListener('timeupdate', (e) => {
            extendedTimeChange()
        })
    } else {
        audioArr[audioCount].addEventListener('timeupdate', (e) => {
            extendedTimeChange()
        })
    }

}

function extendedSetTime(value) {
    audioArr[audioCount].currentTime = Math.floor((audioArr[audioCount].duration / 100) * value)
}

let extCurrentTime = document.querySelector('.extended-player-currenttime')

function extendedTimeChange() {
    let value = Math.floor((audioArr[audioCount].currentTime / audioArr[audioCount].duration) * 100)
    extendedTimeline.value = value
    console.log('change time started2');
    if (audioArr[audioCount].currentTime == audioArr[audioCount].duration) {
        if (audioCount != 3) {
            audioCount++
        } else {
            audioCount = 0
        }
        playAudio(audioCount)
    }

    let firstTime = Math.floor(audioArr[audioCount].currentTime / 60)
    let secondTime = Math.floor(audioArr[audioCount].currentTime % 60)
    firstTime = firstTime <= 0 ? '0' : firstTime
    secondTime = secondTime < 10 ? `0${secondTime}` : secondTime

    extCurrentTime.textContent = `${firstTime}:${secondTime}`
    console.log(extCurrentTime.textContent);
    if (value > 70) {
        extendedTimeline.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${value - 2}%, #fff ${value - 2}%, white 100%)`
    } else {
        extendedTimeline.style.background = `linear-gradient(to right, #3531ad 0%, #3531ad ${value}%, #fff ${value}%, white 100%)`
    }

}
function extendedSetVolume(value) {
    audioArr[audioCount].volume = value / 100
}


let extBreatheCard = document.querySelector('.extended-breathe-track'),
    extChildhoodCard = document.querySelector('.extended-childhood-track'),
    extSolaceCard = document.querySelector('.extended-solace-track'),
    extSolitudeCard = document.querySelector('.extended-solitude-track')

let extCardArr = [extBreatheCard, extChildhoodCard, extSolaceCard, extSolitudeCard]

extBreatheCard.addEventListener('mousedown', () => {
    if (!extBreatheCard.classList.contains('extended-card-active')) {
        extCardClearActives()
        extBreatheCard.classList.add('extended-card-active')
        audioCount = 0
    }
})
extChildhoodCard.addEventListener('mousedown', () => {
    if (!extChildhoodCard.classList.contains('extended-card-active')) {
        extCardClearActives()
        extChildhoodCard.classList.add('extended-card-active')
        audioCount = 1
    }
})
extSolaceCard.addEventListener('mousedown', () => {
    if (!extSolaceCard.classList.contains('extended-card-active')) {
        extCardClearActives()
        extSolaceCard.classList.add('extended-card-active')
        audioCount = 2
    }
})
extSolitudeCard.addEventListener('mousedown', () => {
    if (!extSolitudeCard.classList.contains('extended-card-active')) {
        extCardClearActives()
        extSolitudeCard.classList.add('extended-card-active')
        audioCount = 3
    }
})

function extCardClearActives() {
    extBreatheCard.className = 'extended-breathe-track'
    extChildhoodCard.className = 'extended-childhood-track'
    extSolaceCard.className = 'extended-solace-track'
    extSolitudeCard.className = 'extended-solitude-track'
}

let extendedPlaylist = document.querySelector('.extended-playlist')

extendedPlaylist.addEventListener('click', (e) => {
    if (e.target.id === 'breathe-card') {
        playAudio(0)
        audioCount = 0
    } else if (e.target.id === 'childhood-card') {
        playAudio(1)
        audioCount = 1
    } else if (e.target.id === 'solace-card') {
        playAudio(2)
        audioCount = 2
    } else if (e.target.id === 'solitude-card') {
        playAudio(3)
        audioCount = 3
    }
})


// ----------------------VISUALIZER-SCRIPT-------------------------------------



function visualizerStart(link) {
    let visualizer = link.nextElementSibling

    let firstCol = visualizer.querySelector('.visualizer-first-column'),
        secondCol = visualizer.querySelector('.visualizer-second-column'),
        thirdCol = visualizer.querySelector('.visualizer-third-column')

    firstCol.classList.add('first-column-active')
    secondCol.classList.add('second-column-active')
    thirdCol.classList.add('third-column-active')
}

function visualizerStop() {
    let firstCol = document.querySelectorAll('.visualizer-first-column'),
        secondCol = document.querySelectorAll('.visualizer-second-column'),
        thirdCol = document.querySelectorAll('.visualizer-third-column')

    firstCol.forEach((item) => {
        item.className = 'visualizer-first-column'
    })
    secondCol.forEach((item) => {
        item.className = 'visualizer-second-column'
    })
    thirdCol.forEach((item) => {
        item.className = 'visualizer-third-column'
    })

}


// EXTENDED-VISUALIZER


let extendedVisualizer = document.querySelector('.extended-player-visualizer')


function extendedVisualizerStart() {

    for (let i = 0; i < extendedVisualizer.children.length; i++) {
        extendedVisualizer.children[i].classList.add('extended-col-active')

    }
}

function extendedVisualizerStop() {
    for (let i = 0; i < extendedVisualizer.children.length; i++) {
        extendedVisualizer.children[i].classList.remove('extended-col-active')

    }
}

function previewRotateStart() {
    extendedPreview.classList.add('player-preview-active')

}
function previewRotateStop() {
    extendedPreview.classList.remove('player-preview-active')
}

// ---------------------------WEATHER-SCRIPT---------------------------------



let weatherApiKey = '219f67306451b2e9450255248f5b8ff2'
let weatherCity = document.querySelector('.city')
let weatherLang = localStorage.getItem('lang')

let weatherIcon = document.querySelector('.weather-icon'),
    weatherTemp = document.querySelector('.temperature'),
    weatherDescr = document.querySelector('.weather-description'),
    weatherWind = document.querySelector('.wind'),
    weatherHumidity = document.querySelector('.humidity')

let weatherErrorBlock = document.querySelector('.weather-error')

changeWeather()

weatherCity.addEventListener('input', () => {
    changeWeather()
    localStorage.setItem('weather', weatherCity.value)
})



if (!localStorage.getItem('weather') && langChoice === 'en') {
    console.log('eweqe');
    weatherCity.value = 'Minsk'
    localStorage.setItem('weather', 'Minsk')
} else if (!localStorage.getItem('weather') && langChoice === 'ru') {
    console.log('qqqqq');
    weatherCity.value = 'Минск'
    localStorage.setItem('weather', 'Минск')
} else {
    console.log('powep[pp[p');
    weatherCity.value = localStorage.getItem('weather')
}



function changeWeather() {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity.value}&lang=${weatherLang}&units=metric&appid=${weatherApiKey}`;

    let xmlRequest = new XMLHttpRequest()
    xmlRequest.open("GET", `${weatherUrl}`, false)
    xmlRequest.send()

    if (xmlRequest.status != 200) {
        weatherErrorBlock.textContent = xmlRequest.status + ': ' + xmlRequest.statusText
    } else {
        weatherErrorBlock.textContent = ''
    }

    let weatherText = xmlRequest.responseText

    let weatherObj = JSON.parse(weatherText)
    console.log(weatherObj);

    let weatherIconCode = weatherObj.weather[0].id

    weatherIcon.className = `weather-icon owf owf-${weatherIconCode}`
    weatherTemp.textContent = Math.round(weatherObj.main.temp) + '°C'
    weatherDescr.textContent = capitalizeAll(weatherObj.weather[0].description)
    weatherWind.textContent = langData.weather.wind[langChoice] + Math.round(weatherObj.wind.speed) + langData.weather.speed[langChoice]
    weatherHumidity.textContent = langData.weather.humidity[langChoice] + weatherObj.main.humidity + '%'


}

function capitalizeAll(text) {
    let arr = text.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }
    const result = arr.join(" ");
    return result
}



// -------------------------SETTING-SCRIPT---------------------------------




let settingBtn = document.querySelector('.setting-btn'),
    langBtn = document.querySelector('.lang-btn'),
    ghBtn = document.querySelector('.gh-btn'),
    langList = document.querySelector('.lang-list'),
    settings = document.querySelector('.settings'),
    playerBtn = document.querySelector('.player-btn'),
    weatherBtn = document.querySelector('.weather-btn')

let mainPlayer = document.querySelector('.player'),
    mainWeather = document.querySelector('.weather')


if (!localStorage.getItem('playerVisible')) {
    localStorage.setItem('playerVisible', 'true')
} else {
    if (localStorage.getItem('playerVisible') == 'true') {
        mainPlayer.className = 'player'
        playerBtn.children[0].className = 'fal fa-play-circle player-btn-icon'
    }else{
        mainPlayer.className = 'player player-disabled'
        playerBtn.children[0].className = 'fal fa-play-circle player-btn-icon player-icon-disabled'
    }
}

if (!localStorage.getItem('weatherVisible')) {
    localStorage.setItem('weatherVisible', 'true')
}else{
    if (localStorage.getItem('weatherVisible') == 'true') {
        mainWeather.className = 'weather'
        weatherBtn.children[0].className = 'fal fa-thunderstorm-sun weather-btn-icon'
    }else{
        mainWeather.className = 'weather weather-disabled'
        weatherBtn.children[0].className = 'fal fa-thunderstorm-sun weather-btn-icon weather-icon-disabled'
    }
}


settingBtn.addEventListener('click', () => {
    if (settingBtn.classList.contains('setting-btn-active')) {
        settingBtn.classList.remove('setting-btn-active')
        settingMenuDisappear()
    } else {
        settingBtn.classList.add('setting-btn-active')
        settingMenuAppear()
    }
    console.log(localStorage.getItem('lang'));
})
langBtn.addEventListener('click', () => {
    if (langList.classList.contains('lang-list-active')) {
        langList.classList.remove('lang-list-active')
    } else {
        langList.classList.add('lang-list-active')
    }
})

playerBtn.addEventListener('click', () => {

    playerBtn.children[0].classList.toggle('player-icon-disabled')
    mainPlayer.classList.toggle('player-disabled')
    if (mainPlayer.classList.contains('player-disabled')) {
        localStorage.playerVisible = 'false'
    }else{
        localStorage.playerVisible = 'true'
    }
    console.log(localStorage.playerVisible);
})
weatherBtn.addEventListener('click', () => {
    

    weatherBtn.children[0].classList.toggle('weather-icon-disabled')
    mainWeather.classList.toggle('weather-disabled')
    if (mainWeather.classList.contains('weather-disabled')) {
        localStorage.weatherVisible = 'false'
    }else{
        localStorage.weatherVisible = 'true'
    }
    console.log(localStorage.weatherVisible);
})




function settingMenuAppear() {
    langBtn.classList.add('lang-btn-active')
    ghBtn.classList.add('gh-btn-active')
    settings.classList.add('settings-active')
    playerBtn.classList.add('player-btn-active')
    weatherBtn.classList.add('weather-btn-active')
}
function settingMenuDisappear() {
    langBtn.classList.remove('lang-btn-active')
    ghBtn.classList.remove('gh-btn-active')

    settings.classList.remove('settings-active')
    playerBtn.classList.remove('player-btn-active')
    weatherBtn.classList.remove('weather-btn-active')
    if (langList.classList.contains('lang-list-active')) {
        langList.classList.remove('lang-list-active')
    }
}

let englishOption = document.querySelector('.english'),
    russianOption = document.querySelector('.russian')

englishOption.addEventListener('click', () => {
    if (!englishOption.classList.contains('lang-choice')) {
        englishOption.classList.add('lang-choice')
        if (russianOption.classList.contains('lang-choice')) {
            russianOption.classList.remove('lang-choice')
        }
    }
    localStorage.lang = 'en'
    location.reload()

})
russianOption.addEventListener('click', () => {
    if (!russianOption.classList.contains('lang-choice')) {
        russianOption.classList.add('lang-choice')
        if (englishOption.classList.contains('lang-choice')) {
            englishOption.classList.remove('lang-choice')
        }
    }
    localStorage.lang = 'ru'
    location.reload()

})

if (localStorage.lang === 'en') {
    englishOption.classList.add('lang-choice')
} else {
    russianOption.classList.add('lang-choice')
}


let btnGid = document.querySelector('.btn-gid')
let wrapper = document.querySelector('.wrapper')
btnGid.addEventListener('mousedown', () => {
    btnGid.classList.toggle('btn-gid-active')
    wrapper.classList.toggle('wrapper-active')
})

