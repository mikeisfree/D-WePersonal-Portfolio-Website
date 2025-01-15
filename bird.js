(function () {
  const container = document.getElementById("nest3d");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  let bird;
  loader.load(
    "media/bird.glb",
    function (gltf) {
      bird = gltf.scene;
      scene.add(bird);
      animateBird();
    },
    undefined,
    function (error) {
      console.error("An error occurred while loading the bird model:", error);
    }
  );

  function animateBird() {
    gsap.to(bird.position, {
      x: getRandomPosition(),
      y: getRandomPosition(),
      z: getRandomPosition(),
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }

  function getRandomPosition() {
    return Math.random() * 10 - 5;
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", onWindowResize, false);
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
})();
