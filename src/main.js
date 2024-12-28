import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Fire } from './Fire';
import { Tree } from './Tree';
import { Log } from './Log';
import { Fox } from './Fox';
import { Squirrel } from './Squirrel';
import { Stars } from './Stars';
import { Moon } from './Moon';

let scene, camera, renderer, controls;
let fire, stars, moon;

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  scene.fog = new THREE.FogExp2(0x000814, 0.02);

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 15);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  document.body.appendChild(renderer.domElement);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance = 5;
  controls.maxDistance = 25;

  // Add moon
  moon = new Moon();
  scene.add(moon.group);
  scene.add(moon.light);

  // Ground
  const groundGeometry = new THREE.CircleGeometry(40, 64);
  const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x234d1f,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Ambient light (reduced intensity due to moon)
  const ambientLight = new THREE.AmbientLight(0x404860, 0.3);
  scene.add(ambientLight);

  // Ground bounce light
  const groundAmbient = new THREE.HemisphereLight(
    0xc7d1e3, // Sky color
    0x234d1f, // Ground color
    0.2 // Reduced intensity
  );
  scene.add(groundAmbient);

  // Add stars
  stars = new Stars();
  scene.add(stars.mesh);

  // Add fire
  fire = new Fire();
  scene.add(fire.mesh);

  // Fire lighting
  const fireLight = new THREE.PointLight(0xff6630, 1.5, 10);
  fireLight.position.set(0, 1, 0);
  fireLight.castShadow = true;
  scene.add(fireLight);

  // Add logs for fire
  const fireLogPositions = [
    { x: 0.2, y: 0.1, z: 0, rot: 0 },
    { x: -0.2, y: 0.1, z: 0.1, rot: Math.PI / 3 },
    { x: 0, y: 0.1, z: -0.2, rot: -Math.PI / 4 }
  ];

  fireLogPositions.forEach(pos => {
    const log = new Log(0.1, 0.8); // smaller logs for the fire
    log.mesh.position.set(pos.x, pos.y, pos.z);
    log.mesh.rotation.y = pos.rot;
    scene.add(log.mesh);
  });

  // Add sitting logs in a circle
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 3;
    const log = new Log(0.2, 2); // bigger logs for sitting
    log.mesh.position.x = Math.cos(angle) * radius;
    log.mesh.position.z = Math.sin(angle) * radius;
    log.mesh.rotation.y = angle + Math.PI / 2;
    scene.add(log.mesh);
  }

  // Add dense forest
  const treeCircles = [
    { radius: 10, count: 15 },
    { radius: 15, count: 20 },
    { radius: 20, count: 25 },
    { radius: 25, count: 30 },
    { radius: 30, count: 35 }
  ];

  // Add random trees between circles for more natural distribution
  const randomTrees = 50;
  for (let i = 0; i < randomTrees; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 25;
    const tree = new Tree();
    tree.mesh.position.x = Math.cos(angle) * radius;
    tree.mesh.position.z = Math.sin(angle) * radius;
    tree.mesh.rotation.y = Math.random() * Math.PI * 2;
    const scale = 0.7 + Math.random() * 0.6;
    tree.mesh.scale.set(scale, scale + Math.random() * 0.4, scale);
    scene.add(tree.mesh);
  }

  // Add circle of trees
  treeCircles.forEach(circle => {
    for (let i = 0; i < circle.count; i++) {
      const angle = (i / circle.count) * Math.PI * 2;
      const radius = circle.radius + (Math.random() - 0.5) * 4;
      const tree = new Tree();
      tree.mesh.position.x = Math.cos(angle) * radius;
      tree.mesh.position.z = Math.sin(angle) * radius;
      tree.mesh.rotation.y = Math.random() * Math.PI * 2;
      const scale = 0.7 + Math.random() * 0.6;
      tree.mesh.scale.set(scale, scale + Math.random() * 0.4, scale);
      scene.add(tree.mesh);
    }
  });

  // Add animals
  const fox = new Fox();
  fox.mesh.position.set(-4, 0, -2);
  fox.mesh.rotation.y = Math.PI / 4;
  scene.add(fox.mesh);

  const squirrel1 = new Squirrel();
  squirrel1.mesh.position.set(3, 0, -3);
  squirrel1.mesh.rotation.y = -Math.PI / 3;
  scene.add(squirrel1.mesh);

  const squirrel2 = new Squirrel();
  squirrel2.mesh.position.set(-2, 0, 4);
  squirrel2.mesh.rotation.y = Math.PI / 6;
  scene.add(squirrel2.mesh);

  window.addEventListener('resize', onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  fire.update();
  stars.update();
  
  // Subtle moon glow animation
  const time = Date.now() * 0.0005;
  moon.group.children[1].material.uniforms.coefficient.value = 0.5 + Math.sin(time) * 0.05;
  
  controls.update();
  renderer.render(scene, camera);
}

init();
