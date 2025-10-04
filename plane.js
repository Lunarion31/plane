console.clear();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFD5E53);

const pointLight = new THREE.PointLight(0xFF7518, 1);
pointLight.position.set(70, -20, 150);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xccccff, 0.8);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(0, 100, -400);
camera.lookAt(0, 0, 0);

const loader = new THREE.OBJLoader();
let plane;

loader.load('https://assets.codepen.io/557388/1405+Plane_1.obj', (obj) => {
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshPhongMaterial({
        color: 0x353839,
        specular: 0xd0cbc7,
        shininess: 5,
        flatShading: true
      });
    }
  });

  plane = obj;
  plane.position.set(0, 0, 0);
  scene.add(plane);
});

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

function animate() {
  requestAnimationFrame(animate);

  if (plane) {
    plane.rotation.y = mouseX * Math.PI * 0.25;
    plane.rotation.x = mouseY * Math.PI * 0.15;

    const noseOffset = new THREE.Vector3(0, 20, 50);
    const noseWorldPos = noseOffset.clone().applyEuler(plane.rotation).add(plane.position);
    pointLight.position.lerp(noseWorldPos, 0.2);

    pointLight.intensity = 0.8 + 0.6 * Math.abs(mouseY);
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
