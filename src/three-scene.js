import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch (e) {
    return false
  }
}

if (!isWebGLAvailable()) {
  // eslint-disable-next-line no-throw-literal
  throw 'WebGL not supported — 3D scene skipped'
}

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 20

const scene = new THREE.Scene()
let robot
let mixer

const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('container3d').appendChild(renderer.domElement)

const loader = new GLTFLoader()
loader.load('/media/test_sphere_maya_deformers.glb', function (gltf) {
  robot = gltf.scene
  scene.add(robot)
  mixer = new THREE.AnimationMixer(robot)
  mixer.clipAction(gltf.animations[0]).play()
  modelMove()
})

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
scene.add(ambientLight)
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(500, 0, 0)
scene.add(topLight)

const reRender3D = () => {
  requestAnimationFrame(reRender3D)
  renderer.render(scene, camera)
  if (mixer) mixer.update(0.01)
}

reRender3D()

const arrPositionModel = [
  {
    id: 'gradientThree',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'functionalThree',
    position: { x: -7, y: 0, z: 15 },
    rotation: { x: 0, y: 2, z: 0 },
  },
  {
    id: 'eleganThree',
    position: { x: 6, y: 1, z: -2 },
    rotation: { x: 0, y: -1, z: 0 },
  },
  {
    id: 'stylishThree',
    position: { x: -4, y: 0, z: -10 },
    rotation: { x: 0, y: 1, z: 0 },
  },
  {
    id: 'modernThree',
    position: { x: 5, y: 1, z: 0 },
    rotation: { x: 1, y: -2, z: 0 },
  },
]

function modelMove() {
  const sections = document.querySelectorAll('.sectionThree')
  let currentSection
  sections.forEach((sectionThree) => {
    const rect = sectionThree.getBoundingClientRect()
    if (rect.top <= window.innerHeight / 3) {
      currentSection = sectionThree.id
    }
  })
  const position_active = arrPositionModel.findIndex(
    (val) => val.id === currentSection
  )
  if (position_active >= 0) {
    const new_coordinates = arrPositionModel[position_active]
    gsap.to(robot.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 1,
      ease: 'power1.inOut',
    })
    gsap.to(robot.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      ease: 'power1.inOut',
    })
  }
}

window.addEventListener('scroll', () => {
  if (robot) {
    modelMove()
  }
})

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
