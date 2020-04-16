const model = document.getElementById('model');

// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------
import * as THREE from '../build/three.module.js';
// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(50, 300/200, 0.1, 100);
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#F7F7F7");

// Configure renderer size
renderer.setSize(300, 200);

// ------------------------------------------------
// CONTROL
// ------------------------------------------------
import { OrbitControls } from './jsm/controls/OrbitControls.js';
var controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.enableZoom = false
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
}
// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry(0.5, 2, 1);
var material = new THREE.MeshBasicMaterial({ color: "#433F81" });
var cube = new THREE.Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

// Render Loop

var render = function () {
  requestAnimationFrame(render);
  controls.update();
  // Render the scene
  renderer.render(scene, camera);
};

const xyz = document.getElementById('xyz');
model.addEventListener('mouseup', () => {
  controls.update();
  console.log(camera.position)
  const x = camera.position.x;
  const y = camera.position.y;
  const z = camera.position.z;
  const alpha = Math.round(THREE.Math.radToDeg(Math.atan(y/x)));
  const beta = Math.round(THREE.Math.radToDeg(Math.atan(Math.sqrt(x*x + y*y)/z)));

  let A = {};
  A.x = Math.round(THREE.Math.radToDeg(camera.rotation.x));
  A.y = Math.round(THREE.Math.radToDeg(camera.rotation.y));
  A.z = Math.round(THREE.Math.radToDeg(camera.rotation.z));
  // xyz.innerHTML = "X" + A.x + "Y" + A.y + "Z" + A.z;
  xyz.innerHTML = alpha + "_" + beta;
});
model.appendChild(renderer.domElement);
render();