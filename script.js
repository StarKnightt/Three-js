const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ 
    size: 0.05,
    color: 0x00ffff,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create torus
const torusGeometry = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
const torusMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff00ff,
    shininess: 100,
    wireframe: true
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Create spheres
const spheres = [];
for(let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(`hsl(${i * 72}, 100%, 50%)`),
        shininess: 150
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = Math.cos(i * Math.PI * 0.4) * 8;
    sphere.position.y = Math.sin(i * Math.PI * 0.4) * 8;
    scene.add(sphere);
    spheres.push(sphere);
}

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.z = 15;

// Mouse movement
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate torus
    torus.rotation.x = elapsedTime * 0.5;
    torus.rotation.y = elapsedTime * 0.2;

    // Animate spheres
    spheres.forEach((sphere, i) => {
        sphere.position.x = Math.cos(elapsedTime + i) * 8;
        sphere.position.y = Math.sin(elapsedTime + i) * 8;
        sphere.rotation.x = elapsedTime * 0.5;
        sphere.rotation.y = elapsedTime * 0.2;
    });

    // Animate particles
    particlesMesh.rotation.y = elapsedTime * 0.1;
    particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;

    // Camera movement based on mouse
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();