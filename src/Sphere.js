const THREE = require('three')

function Sphere () {
  let material = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    specular: 0x050505,
    shininess: 100
  } )
  let geometry = new THREE.IcosahedronBufferGeometry(2, 2)
  let sphere = new THREE.Mesh(geometry , material)
  console.log(sphere)
  return sphere
}

module.exports = Sphere