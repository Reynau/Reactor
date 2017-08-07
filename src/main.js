const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const getMusicData = require('./AudioManipulator')
const Sphere = require('./Sphere')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera, scene, light, sphere, controls, basePositions

setScene()
animate()

function setScene () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 )
  camera.position.y = 0
  camera.position.z = 10

  scene = new THREE.Scene()
  scene.background = new THREE.Color("#f0f0f0")

  light = new THREE.AmbientLight(0x909090)
  scene.add(light)

  let bluePoint = new THREE.PointLight(0x0033ff, 3, 150)
  bluePoint.position.set( 70, 5, 70 )
  scene.add(bluePoint)

  let greenPoint = new THREE.PointLight(0x33ff00, 1, 150)
  greenPoint.position.set( -70, 5, 70 )
  scene.add(greenPoint)

  let redPoint = new THREE.PointLight(0xff3300, 1, 150)
  redPoint.position.set( 0, 70, -70 )
  scene.add(redPoint)

  let yellowPoint = new THREE.PointLight(0x990099, 1, 150)
  yellowPoint.position.set( 0, -70, 0 )
  scene.add(yellowPoint)

  scene.add(light)

  sphere = new Sphere()
  scene.add(sphere);

  basePositions = clone(sphere.geometry.attributes.position.array)

  controls = new OrbitControls(camera)
}

function updateSphereVertices (musicArray) {
  let freq = 0
  let positionsArray = sphere.geometry.attributes.position.array
  for (let i = 0; i < positionsArray.length && freq < musicArray.length; i += 3) {
    positionsArray[i] = basePositions[i] + musicArray[freq]
    positionsArray[i+1] = basePositions[i+1] + musicArray[freq]
    positionsArray[i+2] = basePositions[i+2] + musicArray[freq]

    ++freq
  }
  sphere.geometry.attributes.position.needsUpdate = true
}

function animate () {
  requestAnimationFrame( animate )
  updateSphereVertices(getMusicData())
  renderer.render(scene, camera)
}