import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

document.body.appendChild(renderer.domElement)

const material = new THREE.MeshPhongMaterial();


const canvas = document.createElement('canvas')

const canvasTexture = new THREE.Texture(canvas)
const canvasMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture, side: THREE.DoubleSide })
var mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), canvasMaterial)

//scene.add(mesh);

const controls = new OrbitControls(camera, renderer.domElement)

scene.background = new THREE.Color('lightgreen')

const light = new THREE.AmbientLight(0x404040, 1) // soft white light scene.add( light );

scene.add(light)

const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1).normalize()
scene.add(directionalLight)

const loader = new GLTFLoader()

loader.load(
    './Chalkboard.gltf',
    function (gltf) {
        scene.add(gltf.scene)
        camera.lookAt(scene.position)
    },
    undefined,
    function (error) {
        console.error(error)
    }
)
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
