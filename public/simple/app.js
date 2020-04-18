const model = document.getElementById('model');
const W = 350;
const H = W * 0.75;

import * as THREE from '../build/three.module.js';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
camera.position.z = 4;
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#F7F7F7");
renderer.setSize(W, H);

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

var geometry = new THREE.BoxGeometry(0.5, 2, 1);
var material = new THREE.MeshBasicMaterial({ color: "#433F81" });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

var render = function () {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
};

let phi = 0;
let theta = 0;
const info = document.getElementById('info');
model.addEventListener('mouseup', () => {
  let S = new THREE.Spherical();
  S.setFromVector3(camera.position);
  phi = Math.round(THREE.Math.radToDeg(S.phi));
  theta = Math.round(THREE.Math.radToDeg(S.theta));
  info.value += "A" + phi + "B" + theta + '\n';
  info.scrollTop = info.scrollHeight;
});
model.appendChild(renderer.domElement);
render();