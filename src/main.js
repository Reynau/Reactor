const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const getMusicData = require('./AudioManipulator')
const Sphere = require('./Sphere')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera, scene, sphere, controls, basePositions
let vertexsArray

setScene()
getUnrepeatedVertices()
animate()

function setScene () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 )
  camera.position.y = 0
  camera.position.z = 10

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

function getUnrepeatedVertices () {
  let positionsArray = sphere.geometry.attributes.position.array
  let normalsArray = sphere.geometry.attributes.normal.array
  let hash = {}

  let count = 0
  for (let i = 0; i < positionsArray.length; i += 3) {
    let x = positionsArray[i]
    let y = positionsArray[i+1]
    let z = positionsArray[i+2]

    let nx = normalsArray[i]
    let ny = normalsArray[i+1]
    let nz = normalsArray[i+2]

    let hashVal = '' + x + y + z

    if (hash[hashVal] === undefined) hash[hashVal] = []
    hash[hashVal].push(i)
    hash[hashVal].push(i+1)
    hash[hashVal].push(i+2)
    ++count
  }

  vertexsArray = []
  for (let prop in hash) {
    let vertex = hash[prop]
    vertexsArray.push(vertex[0])
    vertexsArray.push(vertex[1])
    vertexsArray.push(vertex[2])
  }
}

function updateSphereFaces2 (musicArray) {
  let positionsArray = sphere.geometry.attributes.position.array
  let normalsArray = sphere.geometry.attributes.normal.array
  for (let i = 0; i < vertexsArray.length && i < musicArray.length; i += 3) {
    let x = vertexsArray[i]
    let y = vertexsArray[i+1]
    let z = vertexsArray[i+2]

    positionsArray[x] = basePositions[x] + normalsArray[x] * musicArray[i]
    positionsArray[y] = basePositions[y] + normalsArray[y] * musicArray[i]
    positionsArray[z] = basePositions[z] + normalsArray[z] * musicArray[i]
  }
  sphere.geometry.attributes.position.needsUpdate = true
}

function updateSphereFaces (musicArray) {
  let freq = 0
  let positionsArray = sphere.geometry.attributes.position.array
  let normalsArray = sphere.geometry.attributes.normal.array
  for (let i = 0; i < positionsArray.length && freq < musicArray.length; i += 3) {
    positionsArray[i] = basePositions[i] + normalsArray[i]*musicArray[freq]
    positionsArray[i+1] = basePositions[i+1] + normalsArray[i+1]*musicArray[freq]
    positionsArray[i+2] = basePositions[i+2] + normalsArray[i+2]*musicArray[freq]

    ++freq
  }
  sphere.geometry.attributes.position.needsUpdate = true
}

function animate () {
  requestAnimationFrame( animate )
  updateSphereFaces(getMusicData())
  renderer.render(scene, camera)
}