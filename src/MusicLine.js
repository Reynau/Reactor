function MusicLine (width) {
  let canvas = document.getElementById("controllerCanvas")
  let ctx = canvas.getContext("2d")

  canvas.width = width
  canvas.height = 50

  ctx.lineWidth = 5
  ctx.strokeStyle = "blue"

  this.time = null
  this.pixelsPerTimeUnit = null

  this.pixels = 0

  this.update = function () {
    if (this.time == undefined) return
    this.pixelsPerTimeUnit = width / this.time

    if (this.pixels > width) return

    console.log(this.pixels)
    console.log(this.pixelsPerTimeUnit)

    ctx.beginPath()
    ctx.moveTo(this.pixels, 0)
    ctx.lineTo(this.pixels + this.pixelsPerTimeUnit, 0)
    ctx.stroke()

    this.pixels += this.pixelsPerTimeUnit
  }

  this.setAudioTime = function (time) {
    this.time = time
    this.pixelsPerTimeUnit = width / time
  }
}

module.exports = MusicLine