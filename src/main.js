const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 )
camera.position.z = 20

let scene = new THREE.Scene()

let light = new THREE.DirectionalLight( 0xffffff )
light.position.set(0,0.5,0.5)
scene.add(light)

let material = new THREE.MeshBasicMaterial( { color: 0x555555, wireframe: true, morphTargets: true } )
// let material = new THREE.MeshLambertMaterial( { color: 0xffffff, morphTargets: true } )
let geometry = new THREE.SphereGeometry( 3, 20, 20 )

srcVertices = geometry.vertices

for (let i = 0; i < srcVertices.length; i++) {
  let vertices = []
  for (let v = 0; v < geometry.vertices.length; v++ ) {
    vertices.push(geometry.vertices[v].clone())
    if (v === i) {
      vertices[vertices.length - 1].x *= 2;
      vertices[vertices.length - 1].y *= 2;
      vertices[vertices.length - 1].z *= 2;
    }
  }
  geometry.morphTargets.push( { name: "morph" + i, vertices: vertices } );
}

let sphere = new THREE.Mesh( geometry, material )
scene.add( sphere )


let animate = function () {
  requestAnimationFrame( animate )
  updateVerts()
  renderer.render(scene, camera)
};

function updateVerts () {
  for (let i = 0; i < sphere.geometry.vertices.length; i++)
    updateVert(i, Math.random())
}

function updateVert (i, value) {
  sphere.morphTargetInfluences[i] = value
}


let controls = new OrbitControls(camera)

animate()