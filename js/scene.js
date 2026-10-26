import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.querySelector("#bayzo-scene");
if (!canvas) {
  document.body.classList.add("scene-off");
} else {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (err) {
    document.body.classList.add("scene-off");
    renderer = null;
  }

  if (renderer) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07110c);
    scene.fog = new THREE.Fog(0x07110c, 14, 24);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(-0.4, 0.85, 7.4);

    const bird = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.012, 12, 90),
      new THREE.MeshBasicMaterial({ color: 0x6dffb0, transparent: true, opacity: 0.55 })
    );
    ring.position.z = -0.35;
    bird.add(ring);
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.006, 12, 90),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })
    );
    ring2.position.z = -0.4;
    bird.add(ring2);
    scene.add(bird);

    const loader = new THREE.TextureLoader();
    loader.load("img/chicken.png", (map) => {
      map.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map,
        transparent: true,
        depthWrite: false
      }));
      const aspect = map.image.width / Math.max(map.image.height, 1);
      const height = 3.35;
      sprite.scale.set(height * aspect, height, 1);
      sprite.position.z = 0.05;
      bird.add(sprite);
    });

    const dots = new Float32Array(80 * 3);
    for (let i = 0; i < dots.length; i += 3) {
      dots[i] = (Math.random() - 0.5) * 8;
      dots[i + 1] = Math.random() * 3.2 - 0.4;
      dots[i + 2] = (Math.random() - 0.5) * 6;
    }
    const spark = new THREE.Points(
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(dots, 3)),
      new THREE.PointsMaterial({ color: 0xc8ffe0, size: 0.025, transparent: true, opacity: 0.75 })
    );
    scene.add(spark);

    scene.add(new THREE.AmbientLight(0xf2fff6, 0.55));
    const key = new THREE.DirectionalLight(0xfff4e4, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9dffc0, 0.55);
    rim.position.set(-4, 2, -2);
    scene.add(rim);
    const fill = new THREE.PointLight(0xfff4df, 6, 14);
    fill.position.set(1.5, 0.2, 2);
    scene.add(fill);

    let baseX = 1.85;
    let baseY = -0.05;

    function fit() {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const phone = width < 760;
      const narrow = !phone && (width < 980 || height < 460);
      camera.aspect = width / Math.max(height, 1);
      if (phone) {
        camera.fov = 32;
        camera.position.set(0.1, 0.15, 8.6);
        baseX = 0.15;
        baseY = -0.15;
        bird.scale.setScalar(0.62);
      } else if (narrow) {
        camera.fov = 32;
        camera.position.set(0, 0.85, 7.4);
        baseX = 0;
        baseY = 0.35;
        bird.scale.setScalar(0.66);
      } else {
        camera.fov = 32;
        camera.position.set(-0.4, 0.55, 7.6);
        baseX = 2.15;
        baseY = 0.42;
        bird.scale.setScalar(0.64);
      }
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone || narrow ? 1.25 : 1.6));
      renderer.setSize(width, height, false);
    }

    fit();
    window.addEventListener("resize", fit);

    const clock = new THREE.Clock();
    function frame() {
      const t = clock.getElapsedTime();
      if (!reduced) {
        bird.position.set(baseX, baseY + Math.sin(t * 1.2) * 0.06, 0);
        ring.rotation.z = t * 0.25;
        ring2.rotation.z = -t * 0.18;
        spark.rotation.y = t * 0.05;
      }
      renderer.render(scene, camera);
      if (!reduced) requestAnimationFrame(frame);
    }
    frame();
    document.body.classList.add("scene-on");
  }
}
