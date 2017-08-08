const THREE = require('three')

function Sphere () {

  let sphereGeom = new THREE.IcosahedronBufferGeometry(2, 4)
  let planetMaterial = new THREE.MeshPhongMaterial({color: 0xff44c8})
  planetMaterial.side = THREE.DoubleSide
  let wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true
  wireFrameMat.visible = false

  let sphere = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [planetMaterial, wireFrameMat])
  sphere.geometry = sphereGeom
  sphere.planetMaterial = planetMaterial
  sphere.wireFrameMat = wireFrameMat
  console.log(sphere)
  return sphere
}

module.exports = Sphere