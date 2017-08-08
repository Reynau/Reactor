const THREE = require('three')

function Sphere () {

  let sphereGeom = new THREE.IcosahedronBufferGeometry(2, 2)
  let planetMaterial = new THREE.MeshPhongMaterial({color: 0xff44c8})
  let wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true
  wireFrameMat.visible = false

  let sphere = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [planetMaterial, wireFrameMat])
  sphere.geometry = sphereGeom
  console.log(sphere)
  return sphere
}

module.exports = Sphere