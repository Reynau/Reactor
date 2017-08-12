const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const AudioManipulator = require('./AudioManipulator')
const MusicLine = require('./MusicLine')
const Sphere = require('./Sphere')

let width = document.getElementById('renderer').offsetWidth
let height = window.innerHeight / 3 * 2

let renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.shadowMapEnabled = true
document.getElementById("renderer").appendChild(renderer.domElement)

let camera, scene, sphere, basePositions
let audioManipulator = new AudioManipulator()
let musicLine = new MusicLine(width)
let time = 0
let musicState = false

setScene()
window.onload = function () {
  animate()
}

window.onresize = function () {
  width = document.getElementById('renderer').offsetWidth
  height = window.innerHeight / 3 * 2

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

document.getElementById('repr_btn').onclick = changeState

function changeState () {
  if (musicState) {
    document.getElementById('audioElement').pause()
    document.getElementById('repr_btn').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>'
  }
  else {
    document.getElementById('audioElement').play()
    document.getElementById('repr_btn').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
  }
  musicState = !musicState
}

function setScene() {
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
  camera.position.y = 0
  camera.position.z = 15

  scene = new THREE.Scene()
  scene.background = new THREE.Color("#202020")

  // add subtle ambient lighting
  let ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  // add spotlight for the shadows
  let spotLight = new THREE.DirectionalLight(0xffffff);
  spotLight.position.set(-20, 30, 40);
  spotLight.intensity = 1.5;
  scene.add(spotLight);


  sphere = new Sphere()
  scene.add(sphere);

  basePositions = clone(sphere.geometry.attributes.position.array)

  controls = new OrbitControls(camera)
}

function animate() {
  requestAnimationFrame(animate)
  if (audioManipulator.getDuration() === null) return

  let musicData = audioManipulator.getMusicData()
  sphere.update(musicData, time)
  renderer.render(scene, camera)
  ++time
}