import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer({
    antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

document.body.appendChild(renderer.domElement)

// Create cube and add to scene.


const material = new THREE.MeshPhongMaterial()

var geometry = new THREE.BoxGeometry(10, 20, 20, 50, 50, 50);
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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

var drawStartPos = { x: 0, y: 0 }
var canvasmaterial = new THREE.MeshPhongMaterial()



setupCanvasDrawing();

function setupCanvasDrawing() {
    // get canvas and context
    var drawingCanvas = document.getElementById('drawing-canvas');
var drawingCanvas2 = document.getElementById('drawing-canvas-2');
var drawingContext = (drawingCanvas as any).getContext('2d');
var drawingContext2 = (drawingCanvas2 as any).getContext('2d');

// draw white background
drawingContext.fillStyle = "#FFFFFF";
drawingContext.fillRect(0,0,128,128);
drawingContext2.fillStyle = "#FFFFFF";
drawingContext2.fillRect(0,0,128,128);

// set canvas as bumpmap
material.color = new THREE.Color( 1, 1, 1 );
material.map = new THREE.Texture(drawingCanvas as any);

// set the variable to keep track of when to draw
var paint = false;
var paint2 = false;

// add canvas event listeners
drawingCanvas?.addEventListener('mousedown', function(e){
  paint = true
  drawStartPos = {x:e.offsetX, y:e.offsetY};
});
drawingCanvas?.addEventListener('mousemove', function(e){
    if(paint){
      draw(drawingContext, 0, e.offsetX, e.offsetY);
  }
});
drawingCanvas?.addEventListener('mouseup', function(e){
  paint = false;
});
drawingCanvas?.addEventListener('mouseleave', function(e){
  paint = false;
});

drawingCanvas2?.addEventListener('mousedown', function(e){
  paint2 = true
  drawStartPos = {x:e.offsetX, y:e.offsetY};
});
drawingCanvas2?.addEventListener('mousemove', function(e){
    if(paint2){
      draw(drawingContext2, 1, e.offsetX, e.offsetY);
  }
});
drawingCanvas2?.addEventListener('mouseup', function(e){
  paint2 = false;
});
drawingCanvas2?.addEventListener('mouseleave', function(e){
  paint2 = false;
});
}

// Draw function
function draw(drawContext: any, type: any,  x: number, y: number) {
drawContext.moveTo(drawStartPos.x, drawStartPos.y);
if(type){
  // is displacement
drawContext.strokeStyle = '#000000';
}else{
  // is bump
drawContext.strokeStyle = '#000000';
}
drawContext.lineTo(x,y);
drawContext.stroke();
drawStartPos = {x:x, y:y};
(material as any).map.needsUpdate = true;
//material.displacementMap.needsUpdate = true;
}

function render() {
    renderer.render(scene, camera)
}
animate()
