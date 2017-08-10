const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const AudioManipulator = require('./AudioManipulator')
const MusicLine = require('./MusicLine')
const Sphere = require('./Sphere')

let width = window.innerWidth / 3 * 2
let height = window.innerHeight / 3 * 2

let renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
renderer.shadowMapEnabled = true
document.getElementById("renderer").appendChild(renderer.domElement)

let camera, scene, sphere, basePositions
let audioManipulator = new AudioManipulator()
let musicLine = new MusicLine(document.getElementById("renderer").offsetWidth)
let time = 0

setScene()
window.onload = function () {
  animate()
}

function setScene() {
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
  camera.position.y = 0
  camera.position.z = 30

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
  musicLine.setAudioTime(audioManipulator.getDuration())
  musicLine.update()
  renderer.render(scene, camera)
  ++time
}