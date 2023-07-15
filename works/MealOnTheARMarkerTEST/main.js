import { loadGLTF } from "../../libs/loader.js";
import * as THREE from '../../libs/three.js-r132/build/three.module.js'
import { OrbitControls } from '../../libs/three.js-r132/examples/jsm/controls/OrbitControls.js'

document.addEventListener('DOMContentLoaded', () => {
  // Canvas
  const canvas = document.querySelector('canvas.webgl')

  /**
   * Sizes
   */
  const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
  }

  // Scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color( 0xffffff );

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 2
  scene.add(camera)

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(2, 2, - 1)
  scene.add(directionalLight)
  directionalLight.castShadow = true
  // directionalLight.shadow.mapSize.width = 1024
  // directionalLight.shadow.mapSize.height = 1024

  /**
   * Materials
   */
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0
  material.metalness = 0.3

  /**
   * Objects
   */
  const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      material
  )
  sphere.castShadow = true

  const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.ShadowMaterial({ opacity: 0.2 })
  )
  plane.rotation.x = - Math.PI * 0.5
  plane.position.y = - 0.5
  plane.receiveShadow = true

  scene.add(sphere, plane)

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap


  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  /**
   * Animate
   */
  const clock = new THREE.Clock()

  const tick = () =>
  {
      const elapsedTime = clock.getElapsedTime()

      // Update the sphere
      sphere.position.x = Math.cos(elapsedTime) * 1.5
      sphere.position.z = Math.sin(elapsedTime) * 1.5
      sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

      // Update controls
      controls.update()

      // Render
      renderer.render(scene, camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
  }

  tick()
});
