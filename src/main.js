const THREE = require('three')

let renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )
camera.position.z = 20

let scene = new THREE.Scene()

let light = new THREE.DirectionalLight( 0xffffff )
light.position.set(0,0.5,0.5)
scene.add(light)

let material = new THREE.MeshPhongMaterial()
let geometry = new THREE.SphereGeometry( 3, 100, 100 )
let sphere = new THREE.Mesh( geometry, material )
scene.add( sphere )

let animate = function () {
  requestAnimationFrame( animate )
  renderer.render(scene, camera)
};

animate()