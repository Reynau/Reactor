

function AudioManipulator () {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  let analyser = audioCtx.createAnalyser()
  analyser.fftSize = 4096

  let audioElement = document.getElementById('audioElement')
  let audioSrc = audioCtx.createMediaElementSource(audioElement)

  audioSrc.connect(analyser)
  audioSrc.connect(audioCtx.destination)

  let bufferLength = analyser.frequencyBinCount
  let dataArray = new Float32Array(bufferLength)

  this.duration = null

  audioElement.addEventListener("loadedmetadata", durationCallback(this))

  function durationCallback (self) {
    return (event) => {
      self.duration = audioElement.duration
      console.log('Duration is: ' + self.duration)
    }
  }

  this.getMusicData = function () {
    analyser.getFloatTimeDomainData(dataArray)
    return dataArray
  }

  this.getDuration = function () {
    return this.duration
  }
}

module.exports = AudioManipulator