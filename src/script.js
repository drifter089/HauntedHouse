import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import * as dat from "dat.gui";
import { Float32BufferAttribute } from "three";
import gsap from "gsap";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// fog
const fogg = new THREE.Fog("#425a66", 1, 15);
scene.fog = fogg;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// door
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const dooralphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorheightTexture = textureLoader.load("/textures/door/height.jpg");
const doormetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doornormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorroughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);

// walls
const wallroughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
const wallaoTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");

// grass
const grassroughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);
const grassaoTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");

grassColorTexture.repeat.set(8, 8);
grassaoTexture.repeat.set(8, 8);
grassroughnessTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassaoTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassroughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassaoTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassroughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    transparent: true,
    aoMap: wallaoTexture,
    aoMapIntensity: 1,
    normalMap: wallNormalTexture,
    roughnessMap: wallroughnessTexture,
  })
);
// uv2 for ao map
walls.geometry.setAttribute(
  "uv2",
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

walls.position.y = 2.5 / 2;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: dooralphaTexture,
    aoMap: doorambientOcclusionTexture,
    aoMapIntensity: 2,
    displacementMap: doorheightTexture,
    displacementScale: 0.2,
    normalMap: doornormalTexture,
    metalnessMap: doormetalnessTexture,
    roughnessMap: doorroughnessTexture,
  })
);
// for ao map add uv2 coordinates
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 1;
door.position.z = 2 + 0.001;
house.add(door);

// bush
const bushGeo = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeo, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeo, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeo, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeo, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

/////Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeo = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
graveMaterial.roughness = 0.6;
graveMaterial.metalness = 0.7;

for (let i = 0; i < 100; i++) {
  const angle = Math.random() * 2 * Math.PI;
  const radius = 3 + Math.random() * 6;

  const grave = new THREE.Mesh(graveGeo, graveMaterial);
  grave.position.y = 0.4;
  grave.position.x = radius * Math.cos(angle);
  grave.position.z = radius * Math.sin(angle);
  grave.rotation.y = 0.3 - Math.random() * 0.6;
  grave.rotation.z = 0.2 - Math.random() * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// gui
//   .add(graveMaterial, "roughness")
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .name("grave_rough");
// gui
//   .add(graveMaterial, "metalness")
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .name("grave_mertalness");

////// `cross`
const crosses = new THREE.Group();
scene.add(crosses);

// making geometry
const hor = new THREE.BoxBufferGeometry(2, 0.2, 0.1);
const v = hor.attributes.position.array;
for (let i = 0; i < v.length; i++) {
  const pos = i * 3 + 1;
  v[pos] = v[pos] + 0.5;
}
const ver = new THREE.BoxBufferGeometry(0.4, 2, 0.2);
const crossgeo = BufferGeometryUtils.mergeBufferGeometries([ver, hor], false);
crossgeo.scale(0.5, 0.5, 0.5);

// material;
const crossMat = new THREE.MeshStandardMaterial({ color: "brown" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * 2 * Math.PI;
  const radius = 3 + Math.random() * 6;

  const cross = new THREE.Mesh(crossgeo, crossMat);
  // cross.position.y = 0;
  cross.position.x = radius * Math.cos(angle);
  cross.position.z = radius * Math.sin(angle);
  cross.rotation.y = 0.3 - Math.random() * 0.6;
  cross.rotation.z = 0.2 - Math.random() * 0.4;
  cross.castShadow = true;
  crosses.add(cross);
  let tl = gsap.timeline({ delay: 10 });
  tl.to(cross.position, {
    y: gsap.utils.random(3.5, 5.3),
    stagger: 0.2,
    duration: 5,
    ease: "slow(0.7, 0.7, false)",
  });
  if (i < 25) {
    tl.to(cross.rotation, {
      z: Math.PI,
      duration: 5,
      stagger: 0.5,
      ease: "slow(0.7, 0.7, false)",
    });
  } else {
    tl.to(cross.rotation, {
      z: -Math.PI,
      duration: 5,
      stagger: 0.5,
      ease: "slow(0.7, 0.7, false)",
    });
  }
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    transparent: true,
    aoMap: grassaoTexture,
    aoMapIntensity: 1,
    normalMap: grassNormalTexture,
    roughnessMap: grassroughnessTexture,
  })
);

// uv2 cords for ao
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.15);
// gui
//   .add(ambientLight, "intensity")
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name("amb_intensity");
// scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.15);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001).name("dir_intensity");
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001).name("dir_x");
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001).name("dir_y");
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001).name("dir_z");
scene.add(moonLight);

// Door Light
const dooorLight = new THREE.PointLight("#ff7d46", 1, 7);
dooorLight.position.set(0, 2.2, 2.7);
house.add(dooorLight);

/////ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 3, 3.5);
const ghost2 = new THREE.PointLight("#00ffff", 3, 3.5);
const ghost3 = new THREE.PointLight("#ffff00", 3, 3.5);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = -20;
camera.position.z = 0;
camera.lookAt(house);
scene.add(camera);

// animation
const cameratl = new gsap.timeline({ delay: 0.5 });
cameratl.to(camera.position, { y: -7, duration: 2 });
cameratl.to(camera.position, {
  y: 5,
  z: 13,
  duration: 7,
  onUpdate: () => {
    camera.lookAt(house);
  },
});

cameratl.to(camera.position, {
  y: 10,
  z: 17,
  duration: 7,
  delay: 7,
  onUpdate: () => {
    camera.lookAt(house);
  },
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#425a66");

//////shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
dooorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

let c = -1;

let radius = 0;
let radius3 = 0;
let radius2 = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Updating ghosts
  if (c === 120 || c === -1) {
    radius = 3 + Math.random() * 8;
    radius2 = 2 + Math.random() * 5;
    radius3 = 4 + Math.random() * 10;
    c = 0;
  } else {
    c++;
  }

  const angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(angle) * radius;
  ghost1.position.z = Math.sin(angle) * radius;
  ghost1.position.y = Math.sin(elapsedTime * 3) * 2 + 1;

  const angle2 = -elapsedTime * 0.69 * 0.5;
  ghost2.position.x = Math.cos(angle2) * radius2;
  ghost2.position.z = Math.sin(angle2) * radius2;
  ghost2.position.y =
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 6.9) * 2.3 + 1.4;

  const angle3 = elapsedTime * 0.82 * 0.5;
  ghost3.position.x = Math.sin(angle3) * radius3;
  ghost3.position.z = Math.cos(angle3) * radius3;
  ghost3.position.y =
    Math.sin(-elapsedTime * 5.6) + Math.sin(elapsedTime * 3.3) * 1.7 + 0.7;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
