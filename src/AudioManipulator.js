let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let analyser = audioCtx.createAnalyser()
analyser.fftSize = 4096

let audioElement = document.getElementById('audioElement')
let audioSrc = audioCtx.createMediaElementSource(audioElement)

audioSrc.connect(analyser)
audioSrc.connect(audioCtx.destination)

let bufferLength = analyser.frequencyBinCount
let dataArray = new Float32Array(bufferLength)
analyser.getFloatFrequencyData(dataArray)

function getMusicData () {
  analyser.getFloatTimeDomainData(dataArray)
  return dataArray
}

module.exports = getMusicData