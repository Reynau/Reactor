const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const getMusicData = require('./AudioManipulator')
const Sphere = require('./Sphere')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMapEnabled = true
document.body.appendChild( renderer.domElement )

let camera, scene, sphere, basePositions
let time = 0

setScene()
animate()

function setScene () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 )
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

function animate () {
  requestAnimationFrame( animate )
  sphere.update(getMusicData(), time)
  renderer.render(scene, camera)
  ++time
}