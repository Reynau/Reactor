const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const clone = require('clone')

const getMusicData = require('./AudioManipulator')
const Sphere = require('./Sphere')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera, scene, sphere, basePositions
let vertexsArray
let update = updateSphereVertices

let controls = new function() {
  this.ballColor = '#ff44c8'
  this.showWireFrame = false
  this.modifyVertex = true
}

let gui = new dat.GUI();
gui.addColor(controls, 'ballColor').onChange(function(e) {
  sphere.planetMaterial.color.setStyle(e)
})
gui.add(controls, 'showWireFrame').onChange(function() {
  sphere.wireFrameMat.visible = !sphere.wireFrameMat.visible
})
gui.add(controls, 'modifyVertex').onChange(function() {
  if (update === updateSphereFaces) update = updateSphereVertices
  else update = updateSphereFaces
})

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

function updateSphereFaces (musicArray) {
  let positionsArray = sphere.geometry.attributes.position.array
  let normalsArray = sphere.geometry.attributes.normal.array

  let freq = 0
  for (let i = 0; i < positionsArray.length; i += 9) {
    if (freq >= musicArray.length) freq = 0
    positionsArray[ i ] = basePositions[ i ] + normalsArray[ i ]*musicArray[freq]
    positionsArray[i+1] = basePositions[i+1] + normalsArray[i+1]*musicArray[freq]
    positionsArray[i+2] = basePositions[i+2] + normalsArray[i+2]*musicArray[freq]

    positionsArray[i+3] = basePositions[i+3] + normalsArray[i+3]*musicArray[freq]
    positionsArray[i+4] = basePositions[i+4] + normalsArray[i+4]*musicArray[freq]
    positionsArray[i+5] = basePositions[i+5] + normalsArray[i+5]*musicArray[freq]

    positionsArray[i+6] = basePositions[i+6] + normalsArray[i+6]*musicArray[freq]
    positionsArray[i+7] = basePositions[i+7] + normalsArray[i+7]*musicArray[freq]
    positionsArray[i+8] = basePositions[i+8] + normalsArray[i+8]*musicArray[freq]

    ++freq
  }
  sphere.geometry.attributes.position.needsUpdate = true
}

function updateSphereVertices (musicArray) {
  let freq = 0
  let positionsArray = sphere.geometry.attributes.position.array
  let normalsArray = sphere.geometry.attributes.normal.array
  for (let i = 0; i < positionsArray.length; i += 3) {
    if (freq >= musicArray.length) freq = 0
    positionsArray[i] = basePositions[i] + normalsArray[i]*musicArray[freq]
    positionsArray[i+1] = basePositions[i+1] + normalsArray[i+1]*musicArray[freq]
    positionsArray[i+2] = basePositions[i+2] + normalsArray[i+2]*musicArray[freq]

    ++freq
  }
  sphere.geometry.attributes.position.needsUpdate = true
}

function animate () {
  requestAnimationFrame( animate )
  update(getMusicData())
  renderer.render(scene, camera)
}