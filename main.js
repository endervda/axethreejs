import * as THREE from 'three';
// orbitcontrols

// gltfloader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

//orbitcontrols

//load texture /texture/brick.jpg
const loader = new THREE.TextureLoader();
const texture360 = loader.load('texture/store.jpg');
texture360.encoding = THREE.sRGBEncoding;
const textureRainbow = loader.load('texture/rainbow.jpg');

// load cubetexture /envmap/nx.png

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  'models/envmap/nx.png',
  'models/envmap/px.png',
  'models/envmap/ny.png',
  'models/envmap/py.png',
  'models/envmap/nz.png',
  'models/envmap/pz.png'
]);

   scene.environment = envMap;

// load gltf model /models/astraunant/scene.gltf
const gltfLoader = new GLTFLoader();
gltfLoader.load('/models/axe/scene.gltf', (gltf) => {
  // scale up the model
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.traverse((child) => {
    console.log(child.name);
    child.material = new THREE.MeshStandardMaterial({
      map: textureRainbow,
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.1,
    });
    // making Object_4 & Object_5 matte black

    if (child.name === 'Object_4' || child.name === 'Object_5' || child.name === 'Object_7') {
      child.material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.1,
      });
    }
  });
  // lower on the y
  gltf.scene.position.y = -3;
  scene.add(gltf.scene);
});

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 5, 22, 22 ),
  new THREE.MeshBasicMaterial({
    map: texture360,
    side: THREE.DoubleSide // Correct property
})

);

scene.add( sphere );



camera.position.z = 5;

window.addEventListener('wheel', (event) => {
  const delta = event.deltaY;
  sphere.rotation.y += delta * 0.001; // Adjust the rotation speed as needed
});

//rainbow html text
const text = document.querySelector('.title');

window.addEventListener('wheel', (event) => {
  const delta = event.deltaY;
  text.style.transform = `rotate(${delta * 0.1}deg)`;
});

// rainbow gradient for html text

const colors = ['#FE0004', '#FE9602', '#FFDD00', '#7DC616', '#25A5FE'];

let i = 0;
let scrollCounter = 0;
const scrollThreshold = 5; // Adjust this value to change the speed

window.addEventListener('wheel', (event) => {
  const delta = event.deltaY;
  scrollCounter += Math.abs(delta);

  if (scrollCounter >= scrollThreshold) {
    scrollCounter = 0;
    i = (i + 1) % colors.length;
    text.style.background = `linear-gradient(to right, ${colors[i]}, ${colors[(i + 1) % colors.length]})`;
    text.style.webkitBackgroundClip = 'text';
    text.style.webkitTextFillColor = 'transparent';
  }
});


function animate() {


    renderer.render( scene, camera );

}