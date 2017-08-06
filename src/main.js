const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const getMusicData = require('./AudioManipulator')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera, scene, light, ambLight, materia, geometry, sphere, controls
let waveValue = 0

function setScene () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 )
  camera.position.y = 15
  camera.position.z = 10

  scene = new THREE.Scene()

  light = new THREE.DirectionalLight( 0xffffff )
  light.position.set(0,0.5,0.5)
  scene.add(light)

  ambLight = new THREE.AmbientLight( 0x111111 )
  scene.add(ambLight)

  // material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true } )
  material = new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: true, morphTargets: true } )
  geometry = new THREE.SphereGeometry( 3, 10, 10 )
  initMorphs()
  sphere = new THREE.Mesh( geometry, material )
  scene.add( sphere )

  controls = new OrbitControls(camera)
}

function initMorphs () {
  for (let i = 0; i < geometry.vertices.length; i++) {
    let vertices = []
    for (let v = 0; v < geometry.vertices.length; v++ ) {
      vertices.push(geometry.vertices[v].clone())
      if (v === i) {
        vertices[vertices.length - 1].x *= 2
        vertices[vertices.length - 1].y *= 2
        vertices[vertices.length - 1].z *= 2
      }
    }
    geometry.morphTargets.push( { name: "morph" + i, vertices: vertices } );
  }
}

function animate () {
  requestAnimationFrame( animate )
  let musicDataArray = getMusicData()
  updateVertices(musicDataArray)
  sphere.rotation.y += 0.005
  renderer.render(scene, camera)
}

function updateVertices (musicDataArray) {
  for (let i = 0; i < sphere.geometry.vertices.length && i < musicDataArray.length; i++) {
    updateVertex(i, musicDataArray[i])
  }
}

function updateVertex (i, musicFreq) {
  console.log(musicFreq)
  let newValue = waveValue + musicFreq
  console.log(newValue)
  sphere.morphTargetInfluences[i] = newValue
}


setScene()
animate()