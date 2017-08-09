const THREE = require('three')
const SimplexNoise = require('simplex-noise')
const clone = require('clone')

function Sphere () {
  let sphereGeom = new THREE.IcosahedronBufferGeometry(4, 4)
  let planetMaterial = new THREE.MeshPhongMaterial({color: 0xff44c8})
  planetMaterial.side = THREE.DoubleSide
  let wireFrameMat = new THREE.MeshBasicMaterial()
  wireFrameMat.wireframe = true
  wireFrameMat.visible = true
  wireFrameMat.shading = THREE.FlatShading

  let sphere = THREE.SceneUtils.createMultiMaterialObject(sphereGeom, [planetMaterial, wireFrameMat])
  sphere.geometry = sphereGeom
  sphere.planetMaterial = planetMaterial
  sphere.wireFrameMat = wireFrameMat
  sphere.castShadow = true
  sphere.receiveShadow = false

  let basePositions = clone(sphere.geometry.attributes.position.array)
  sphere.update = function (musicArray, time) {
    let multiplier = getMultiplier(musicArray)

    let simplex = new SimplexNoise(Math.random)

    let positionsArray = sphere.geometry.attributes.position.array
    let normalsArray = sphere.geometry.attributes.normal.array
    for (let i = 0; i < positionsArray.length; i += 3) {
      let x = basePositions[i]
      let y = basePositions[i+1]
      let z = basePositions[i+2]
      let value3d = simplex.noise3D(x, y, z)

      positionsArray[i] = x + normalsArray[i] * value3d * multiplier
      positionsArray[i+1] = y + normalsArray[i+1] * value3d * multiplier
      positionsArray[i+2] = z + normalsArray[i+2] * value3d * multiplier
    }
    sphere.geometry.attributes.position.needsUpdate = true

    sphere.planetMaterial.color.setHSL(Math.sin(time/1000), 0.8, 0.2)
    sphere.wireFrameMat.color.setHSL(Math.sin(time/1000), 0.8, 1)
  }

  function getMultiplier (musicArray) {
    let multiplier = 0
    for (let i = 0; i < musicArray.length; ++i) multiplier += musicArray[i]
    multiplier = (multiplier/musicArray.length) * 100
    if (multiplier > 0 && multiplier <= 0.1 || multiplier < 0 && multiplier >= -0.1) multiplier *= 10
    if (multiplier > 0.1 && multiplier < 0.4 || multiplier < 0.1 && multiplier >= -0.4) multiplier *= 5
    if (multiplier > 7) multiplier = 7.0
    return multiplier
  }

  return sphere
}

module.exports = Sphere